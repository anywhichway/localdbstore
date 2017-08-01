# localdbstore
A thin Web Storage API wrapper around IndexedDB.

Similar to localForage except much lighter since it only supports IndexedDB.

# API

API is identical to Web Storage API except that:

1) the `length` property is missing and replaced with `count()`, since the underlying database may be asynchronously
updated by a different set of code.

2) there is a constructor that must be provided with a database name. For convenience, the constructor takes a second options
argument that defaults to, `{clear:false}`. If `clear` is `true`, then the database will be cleared during the constructor call. The database is created
automatically if it does not exist and is automatically opened.

3) all function calls return Promises

# Release History (reverse chronological order)

v0.0.1 2017-07-31 ALPHA Initial public release
