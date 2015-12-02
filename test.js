var tape = require('tape')
var http = require('http')
var servertest = require('servertest')

var ReqLogger = require('./')

tape('should log basic case', function (t) {
  var logger = ReqLogger(function (obj) {
    t.equal(obj.method, 'GET', 'should have method')
    t.equal(obj.url, '/ok', 'should have url')
    t.equal(obj.statusCode, 200, 'should have statusCode')
    t.ok(obj.responseTime, 'should have responseTime')
    t.end()
  })
  var url = '/ok'
  var opts = {method: 'GET'}
  servertest(createServer(logger), url, opts)
})

tape('should log global opts', function (t) {
  var logger = ReqLogger({version: '1.2.3'}, function (obj) {
    t.equal(obj.version, '1.2.3', 'should have version')
    t.end()
  })
  var url = '/ok'
  var opts = {method: 'GET'}
  servertest(createServer(logger), url, opts)
})

tape('should log local opts', function (t) {
  var logger = ReqLogger(function (obj) {
    t.equal(obj.email, 'user@domain.com', 'should have email')
    t.end()
  })
  var url = '/ok'
  var opts = {method: 'GET'}
  servertest(createServer(logger, {email: 'user@domain.com'}), url, opts)
})

tape('should log local function opts', function (t) {
  var logger = ReqLogger(function (obj) {
    t.equal(obj.company, 'some-company', 'should have company')
    t.end()
  })
  var url = '/ok'
  var opts = {method: 'GET'}
  servertest(createServer(logger, {
    company: function (req, res) { return req.company }
  }), url, opts)
})

tape('should log with delay', function (t) {
  var logger = ReqLogger(function (obj) {
    t.ok(obj.responseTime > 250, 'should have correct responseTime')
    t.end()
  })
  var url = '/delay'
  var opts = {method: 'GET'}
  servertest(createServer(logger), url, opts)
})

function createServer (logger, localOpts) {
  return http.createServer(function (req, res) {
    logger(req, res, localOpts)

    req.company = 'some-company'
    if (req.url === '/ok') {
      res.writeHead(200)
      return res.end('OK')
    }

    if (req.url === '/delay') {
      res.writeHead(200)
      setTimeout(function () {
        res.end('DELAYED')
      }, 250)
    }
  })
}
