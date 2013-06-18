module.exports = {
  initialise: function(app, passport) {

    app.get('/login', function(req, res) {
      res.render('login', { user: req.user });
    });

    app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/login');
    });

    // GET /auth/github
    // Use passport.authenticate() as route middleware to authenticate the
    // request. The first step in GitHub authentication will involve redirecting
    // the user to github.com. After authorization, GitHubwill redirect the user
    // back to this application at /auth/github/callback
    app.get('/auth/github', passport.authenticate('github'), function(req, res) {
        // The request will be redirected to GitHub for authentication, so this
        // function will not be called.
    });

    // GET /auth/github/callback
    // Use passport.authenticate() as route middleware to authenticate the
    // request. If authentication fails, the user will be redirected back to the
    // login page. Otherwise, the primary route function function will be called,
    // which, in this example, will redirect the user to the home page.
    app.get('/auth/github/callback', passport.authenticate('github', { successRedirect: '/', failureRedirect: '/login' }), function(req, res) {
    });

  }
};