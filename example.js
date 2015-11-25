var http = require('http')
var ReqLogger = require('./')

var logger = ReqLogger({
  version: require('./package.json').version // on every request
})

var server = http.createServer(function (req, res) {
  logger(req, res, {
    timestamp: new Date() // just this once
  })

  res.writeHead(200)
  setTimeout(function () {
    res.end('DELAYED')
    server.close()
  }, 250)
})

server.listen(1337)

http.get({
  hostname: 'localhost',
  port: 1337,
  path: '/'
})
