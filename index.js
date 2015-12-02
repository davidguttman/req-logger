var eos = require('end-of-stream')
var xtend = require('xtend')

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
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
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
