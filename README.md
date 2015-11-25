# ReqLogger #

Simple HTTP request logging.

Defaults: `responseTime`, `method`, `url`, `statusCode`

## Example ##

```js
var http = require('http')
var ReqLogger = require('req-logger')

var logger = ReqLogger({
  version: require('./package.json').version // will show on every request
})

var server = http.createServer(function (req, res) {
  logger(req, res, {
    timestamp: new Date() // will show just this once
  })

  res.writeHead(200)
  setTimeout(function () {
    res.end('DELAYED')
    server.close()
  }, 250)
})

server.listen(1337)

// Example output:
// { ip: '127.0.0.1',
//   method: 'GET',
//   url: '/',
//   userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537// .36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36',
//   responseTime: 255,
//   statusCode: 200,
//   version: '1.0.0',
//   timestamp: Wed Nov 25 2015 11:58:44 GMT-0800 (PST) }

```

## API ##

### ReqLogger([opts, cb]) ###

`ReqLogger()` is the main entry point. Accepts optional `opts` (default is `{}`) and optional `cb` (default is `console.log`). Returns a logging function `logger`.

```js
var logger = ReqLogger()

// or

var logger = ReqLogger({version: '1.2.3'}) // shows on every log

// or
var log = bunyan.createLogger({name: 'requests'})
var logger = ReqLogger(function(obj) {
  log.info(obj) // custom logging
})

// logger is now a function that takes req and res as arguments
```

### logger(req, res, [opts, cb]) ###

`logger()` -- call this function when you actually want to log a request. `req` and `res` are required. Accepts `opts` and `cb` like `ReqLogger()` above, but will only apply to the single call. Useful for adding a user or timestamp that isn't on the `req` object.

# License #

MIT
