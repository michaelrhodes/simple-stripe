var form = 'application/x-www-form-urlencoded'
var uenc = encodeURIComponent
var keys = Object.keys

module.exports = stripe

function stripe (conf) {
  conf = conf || {}

  var root = 'https://api.stripe.com/v{version}'
    .replace('{version}', conf.version || 1)

  var authorization = 'Bearer {key}'
    .replace('{key}', conf.key)

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

      var xhr = new XMLHttpRequest
      xhr.open(method, url, true)
      xhr.setRequestHeader('Authorization', authorization)
      xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return
        if (xhr.status === 0) return
        var json = JSON.parse(xhr.responseText)
        return json && json.error ?
          cb(new Error(json.error.message), json) :
          cb(null, json)
      }

      if (!body) return xhr.send()
      xhr.setRequestHeader('Content-Type', form)
      xhr.send(enc(body))
    }
  }
}

function enc (obj) {
  return keys(obj).map(function (key) {
    return [].concat(obj[key]).map(function (val) {
      return uenc(key) + '=' + uenc(val)
    }).join('&')
  }).join('&')
}
