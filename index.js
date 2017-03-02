var eos = require('end-of-stream')
var xtend = require('xtend')
var clientIp = require('client-ip')

module.exports = function ReqLogger (optsGlobal, cbGlobal) {
  if (process.env.NODE_ENV === 'test') return function () {}

  if (typeof optsGlobal === 'function') {
    cbGlobal = optsGlobal
    optsGlobal = {}
  } else {
    optsGlobal = xtend(optsGlobal, {})
  }

  function logReq (req, res, optsLocal, cbLocal) {
    if (typeof optsLocal === 'function') {
      cbLocal = optsLocal
      optsLocal = {}
    } else {
      optsLocal = xtend(optsLocal, {})
    }

    var cb = cbLocal || cbGlobal || console.log

    var tStart = Date.now()

    eos(res, function (err) {
      var info = {
        ip: getIp(req),
        method: req.method,
        url: req.url,
        userAgent: req.headers['user-agent'],
        responseTime: Date.now() - tStart,
        statusCode: res.statusCode
      }
      if (err) info.error = err

      cb(
        xtend(
          info,
          augmentOpts(optsGlobal, req, res),
          augmentOpts(optsLocal, req, res)
        )
      )
    })
  }

  return logReq
}

function augmentOpts (opts, req, res) {
  var augmented = {}
  Object.keys(opts).forEach(function (key) {
    if (typeof opts[key] !== 'function') {
      augmented[key] = opts[key]
    } else {
      augmented[key] = opts[key](req, res)
    }
  })
  return augmented
}

function getIp (req) {
  req.connection.socket = req.connection.socket || {}

  var ips = (clientIp(req) || '')
    .replace('::ffff:', '')
    .replace(/\s/g, '')
    .split(',')

  return ips.length > 1 ? ips[ips.length - 2] : ips[0]
}
