const session = require("express-session");

const session_config = {
        secret: 'your-very-secure-secret-key', // Used to sign the session ID cookie
        resave: false,                         // Prevents resaving session if unmodified
        saveUninitialized: false,              // Forces uninitialized sessions to not be saved
        cookie: { 
          maxAge: 60000 * 30,                  // Session expires in 30 minutes (in milliseconds)
          secure:  true                       // Protects against XSS attacks
        }
};

module.exports = {
    session: session_config
}
