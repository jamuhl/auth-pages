var express = require('express')
  , path = require('path');

module.exports = {
  initialise: function(app, passport) {

    app.get('/', ensureAuthenticated, function(req, res) {
      res.render('index', { user: req.user });
    });

    var staticMiddleware = express.static(path.join(__dirname, "../../docs"));

    app.get("/docs/*", ensureAuthenticated, function(req, res, next) {
      req.url = req.url.replace(/^\/docs/, '');
      staticMiddleware(req, res, next);
    });

    app.get('*', function(req, res) {
      res.send('<html><head><title>404 - Not found</title></head><body><h1>Not found.</h1></body></html>');
    });

  }
};

// Simple route middleware to ensure user is authenticated.
// Use this route middleware on any resource that needs to be protected. If
// the request is authenticated (typically via a persistent login session),
// the request will proceed. Otherwise, the user will be redirected to the
// login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}