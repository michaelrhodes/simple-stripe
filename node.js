var req = require('simple-get')
var enc = require('form-urlencoded')
var form = 'application/x-www-form-urlencoded'

module.exports = stripe

function stripe (conf) {
  conf = conf || {}

  var root = 'https://api.stripe.com/v{version}'
    .replace('{version}', conf.version || 1)

  var headers = {
    'Content-Type': form,
    'Authorization': 'Bearer {key}'
      .replace('{key}', conf.key),
  }

  return function prepare (path, cb) {
    var part = path.split(/\s+/)
    var method = part[1] ? part[0] : 'GET'
    var url = root + (part[1] || part[0])

    return typeof cb == 'function' ?
      request(cb) :
      request

    function request (body, cb) {
      if (typeof body == 'function')
        cb = body, body = null

      var opts = {
        headers: headers,
        method: method,
        url: url
      }

      if (body) opts.body = enc(body)

      req.concat(opts, function (err, res, data) {
        if (err && !data) return cb(err)
        var json = JSON.parse(data)
        return json.error ?
          cb(new Error(json.error.message), json, res) :
          cb(null, json, res)
      })
    }
  }
}
