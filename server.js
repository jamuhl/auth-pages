var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , connect = require('connect')
  , passport = require('passport')
  , GitHubStrategy = require('passport-github').Strategy
  , GitHubApi = require("github")
  , settings = require('./settings');

var github = new GitHubApi({
    version: "3.0.0",
    timeout: 5000
});

app.configure(function() {
  app.use(express.cookieParser(settings.express.cookieSecret));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ store: new connect.middleware.session.MemoryStore() }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.set('views', __dirname + '/lib/views');
  app.set('view engine', 'jade');  
});

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing. However, since this example does not
// have a database of user records, the complete GitHub profile is serialized
// and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the GitHubStrategy within Passport.
// Strategies in Passport require a `verify` function, which accept
// credentials (in this case, an accessToken, refreshToken, and GitHub
// profile), and invoke a callback with a user object.
passport.use(new GitHubStrategy({
    clientID: settings.passport.github.GITHUB_CLIENT_ID,
    clientSecret: settings.passport.github.GITHUB_CLIENT_SECRET,
    callbackURL: settings.passport.github.callbackURL,
    scope: settings.passport.github.scope,
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {

    // asynchronous verification, for effect...
    process.nextTick(function () {

      // auth next github api request
      github.authenticate({
          type: "oauth",
          token: accessToken
      });

      // verify is a team member
      github.orgs.getTeamMember({
        id: settings.passport.github.shouldBeInTeam,
        user: profile.username 
      }, function(err, data) {
        if (err) {
          done(null, false, { message: 'Authenticated user is not a team member.' });
        } else {
          done(err, profile);
        }
      });
      
    });
  }
));

// init routes
require('./lib/routes/auth').initialise(app, passport);
require('./lib/routes/pages').initialise(app, passport);

// kick off server
server.listen(settings.express.port);
console.log('Listening on port ' + settings.express.port);