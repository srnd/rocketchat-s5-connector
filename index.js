var config

try {
  config = require('./config.json')
} catch(e) {
  config = process.env
}

const util = require('util')

const RocketChat = require('./lib/rocketchat')
const rc = new RocketChat(config.RC_HOST, config.RC_TOKEN, config.RC_USER_ID)

const S5 = require('s5')
const s5 = new S5(config.S5_TOKEN, config.S5_SECRET)

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded())

app.post("/hook", (req, res) => {
  if(req.body && req.body.secret && req.body.secret === config.S5_SECRET) {
    s5.getUser(req.body.username, s5User => {
      rc.getUser({ username: req.body.username })
        .then(res => {
          rc.patchUser(res.user._id, {
            name: `${s5User.first_name} ${s5User.last_name}`,
            email: s5User.email
          })

          rc.setUserAvatar(res.user._id, `https://s5.studentrnd.org/photo/${req.body.username}_128/${new Date().getTime()}.png`)
        })
        .catch(err => {
          // Don't do anything, user isn't on rocketchat
        })
    })
  }
    
  res.sendStatus(200)
})

app.listen(process.env.PORT || 8080)