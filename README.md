# sqlt

Simple SQL Templating helper inspired by [Yesql](https://github.com/krisajenkins/yesql)

[![build status](https://secure.travis-ci.org/eugeneware/sqlt.png)](http://travis-ci.org/eugeneware/sqlt)

Give this library the location of a SQL template file, and it will return a function that
you can call with a [mysql](https://www.npmjs.org/package/mysql) or [pg](https://www.npmjs.org/package/pg) connection, an optional array of parameters, and a callback.

## Installation

This module is installed via npm:

``` bash
$ npm install sqlt
```

## Example Usage

### Simple SQL query with no params

Given a SQL template file located in /path/to/queries/getUsers.sql

``` sql
SELECT
  *
FROM
  users;
```

You can get a function that is easily callable with a database connection
handle, and get a callback:

``` js
var sqlt = require('sqlt'),
    mysql = require('mysql');

var conn = mysql.createConnection({
  host: 'yourdatabase.com',
  database: 'yourdbname',
  user: 'yourdbusername',
  password: 'yourpassword'
});

var getUsers = sqlt('/path/to/queries/getUsers.sql');
getUsers(conn, function (err, results) {
  if (err) throw err;
  console.log(results);
});
```

### SQL query with params

Given a SQL template file located in /path/to/queries/getUsersByIdOrEmail.sql

``` sql
SELECT
  *
FROM
  users
WHERE
  id = ? OR email = ?;
```

You can get a function that is easily callable with a database connection
handle, an array of parameters, and get a callback:

``` js
var sqlt = require('sqlt'),
    mysql = require('mysql');

var conn = mysql.createConnection({
  host: 'yourdatabase.com',
  database: 'yourdbname',
  user: 'yourdbusername',
  password: 'yourpassword'
});

var getUsersByIdOrEmail = sqlt('/path/to/queries/getUsersByIdOrEmail.sql');
getUsersByIdOrEmail(conn, [1234, 'bob@hotmail.com'], function (err, results) {
  if (err) throw err;
  console.log(results);
});
```

### Load a directory full of queries

Given a folder that contains a list of `.sql` files (say the `getUsers.sql` and
`getUsersByIdOrEmail.sql` file above:

You can get a single object where each `.sql` file is turned into a query
helping function:

``` js
var sqlt = require('sqlt'),
    mysql = require('mysql');

var conn = mysql.createConnection({
  host: 'yourdatabase.com',
  database: 'yourdbname',
  user: 'yourdbusername',
  password: 'yourpassword'
});

var queries = sqlt.dir('/path/to/queries');
queries.getUsers(conn, function (err, results) {
  if (err) throw err;
  console.log(results);
});
queries.getUsersByIdOrEmail(conn, [1234, 'bob@hotmail.com'], function (err, results) {
  if (err) throw err;
  console.log(results);
});
```

### Pull Requests Welcome!
