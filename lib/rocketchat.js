const request = require('request')

class RocketChat {
  constructor(host, token, userId) {
    this.host = host
    this.token = token
    this.userId = userId
  }

  _get(endpoint, qs = { }) {
    return new Promise((resolve, reject) => {
      request(`${this.host}/api/v1/${endpoint}`, {
        headers: {
          "X-Auth-Token": this.token,
          "X-User-Id": this.userId
        }, qs, json: true
      }, (err, res, body) => {
        if(!err && body.success) resolve(body)
        if(err || !body.success) reject(err || body.error)
      })
    })
  }

  _post(endpoint, form = { }) {
    return new Promise((resolve, reject) => {
      request.post(`${this.host}/api/v1/${endpoint}`, {
        headers: {
          "X-Auth-Token": this.token,
          "X-User-Id": this.userId
        }, form, json: true
      }, (err, res, body) => {
        if(!err && body.success) resolve(body)
        if(err || !body.success) reject(err || body.error)
      })
    })
  }

  me() {
    return this._get("me")
  }

  getUser(params) {
    return this._get("users.info", params)
  }

  patchUser(id, fields) {
    var body = {
      userId: id,
      data: fields
    }
    
    return this._post("users.update", body)
  }

  setUserAvatar(userId, avatarUrl) {
    return this._post("users.setAvatar", { userId, avatarUrl })
  }
}

module.exports = RocketChat