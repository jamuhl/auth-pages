var settings = {
  passport: {
    github: {
      GITHUB_CLIENT_ID: "[your token]",
      GITHUB_CLIENT_SECRET: "[the secret]",
      shouldBeInTeam: '[the team]',
      callbackURL: "http://localhost:8888/auth/github/callback",
      scope: ["user"]
    } 
  },
  express: {
    cookieSecret: "mySecret",
    port: 8888
  }
};

module.exports = settings;