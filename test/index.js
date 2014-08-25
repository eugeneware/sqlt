var expect = require('expect.js'),
    path = require('path'),
    sqlt = require('..');

describe('sqlt', function() {
  // simple mock
  var conn = {
    query: function (stmt, params, cb) {
      if (typeof cb === 'undefined') {
        cb = params;
        params = [];
      }
      cb(null, stmt);
    }
  };

  it('should be able to read a SQL statement', function(done) {
    var getUsers = sqlt(path.join(__dirname, 'fixtures', 'getUsers.sql'));
    getUsers(conn, function (err, res) {
      if (err) return done(err);
      var expected =
        "SELECT\n" +
        "  *\n" +
        "FROM\n" +
        "  users;\n"
      expect(res).to.equal(expected);
      done();
    });
  });

  it('should be able to read a parameterized statement', function(done) {
    var getUsersByIdOrEmail = sqlt(path.join(__dirname, 'fixtures', 'getUsersByIdOrEmail.sql'));
    getUsersByIdOrEmail(conn, [123, 'bob@hotmail.com'], function (err, res) {
      if (err) return done(err);
      var expected =
        "SELECT\n" +
        "  *\n" +
        "FROM\n" +
        "  users\n" +
        "WHERE\n" +
        "  id = ? OR email = ?;\n";
      expect(res).to.equal(expected);
      done();
    });
  });

  it('should be able to read a directory of queries', function(done) {
    var queries = sqlt.dir(path.join(__dirname, 'fixtures'));
    expect(queries.getUsers).to.be.a('function');
    expect(queries.getUsersByIdOrEmail).to.be.a('function');

    doUsers();

    function doUsers() {
      queries.getUsers(conn, function (err, res) {
        if (err) return done(err);
        var expected =
          "SELECT\n" +
          "  *\n" +
          "FROM\n" +
          "  users;\n"
        expect(res).to.equal(expected);
        doParam();
      });
    }

    function doParam() {
      queries.getUsersByIdOrEmail(conn, [123, 'bob@hotmail.com'], function (err, res) {
        if (err) return done(err);
        var expected =
          "SELECT\n" +
          "  *\n" +
          "FROM\n" +
          "  users\n" +
          "WHERE\n" +
          "  id = ? OR email = ?;\n";
        expect(res).to.equal(expected);
        done();
      });
    }
  });
});
