const express = require('express');
const session = require('express-session');
const passport = require('passport');


const request = require('request');
const strategy = require('./strategy.js');
const {secret} = require('./config.js');


const app = express();


app.use( session({
  secret,
  resave: false,
  saveUninitialized: false
}));
app.use( passport.initialize() )
app.use( passport.session() )
passport.use(strategy);

passport.serializeUser(function(user, done) {

  done(null, user
  )
})

passport.deserializeUser(function(obj, done) {
  done(null, obj);
})

app.get("/login", passport.authenticate('auth0', {
  successRedirect: "/followers",
  failureRedirect: "/login",
  failureFlash: true,
  connection: 'github'
}))

app.get("/followers", (req, res, next) => {
  if (req.user) {
    
    const FollowReq = {
      url: req.user._json.followers_url,
      headers: {
        'User-Agent': req.user._json.clientID
      }
    };
    console.log(req.user);
    request(FollowReq, (error, response, body) => {
      res.status(200).send(body);
    });
  }
  else {
    res.redirect("/login")
  }
})

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );