var fs = require('fs'),
    path = require('path');

function makeSql(stmt) {
  return function (conn, params, cb) {
    if (typeof cb === 'undefined' && typeof params === 'function') {
      cb = params;
      params = [];
    }
    if (typeof cb === 'undefined') {
      // for piping
      return conn.query(stmt, params);
    } else {
      conn.query(stmt, params, cb);
    }
  };
}

module.exports = sqlt;
function sqlt(sqlFile) {
  var stmt = fs.readFileSync(sqlFile, 'utf8');
  return makeSql(stmt);
};

module.exports.dir = sqltDir;

function sqltDir(dir) {
  var queries = {};
  function isSql(name){
    return name.slice(-4,name.length) === '.sql';
  }
  var files = fs.readdirSync(dir).filter(isSql);

  var contents = files.map(function(fileName){
    return fs.readFileSync(path.join(dir,fileName)).toString();
  });
  files.forEach(function(fileName,i){
    queries[fileName.slice(0,-4)] = makeSql(contents[i]);
  });
  return queries;
}
