const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { pool } = require('../dbConnect');
const { checkUsername, checkPassword } = require('../validations');

const secret = process.env.SECRET || 'asdf234@#$sdf@#$fdsfsd';

const mySession = session({
    name: 'sessionID',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 //day
    }
});

passport.use(new LocalStrategy(
    (username, password, done) => {
        // input validation
        if (checkUsername(username) || checkPassword(password)){
            return done(null, false, { message: 'Username or password are invalid' });
        }
        
        // login
        pool.query(`SELECT id, first_name, last_name, user_name, password, permission
        FROM users
        WHERE user_name=?`,
        username, (err, results) => {
            if (err) done(err);
                const errorMessage = 'User Name or password does not match'
                
                if (!results.length) return done(null, false, { message: errorMessage });

                const { id, password: hash, first_name, last_name, permission: admin } = results[0];

                bcrypt.compare(password, hash, (err, match) => {
                    if (err) throw err;

                    if (match) {
                        user = {
                            id: id,
                            username: username,
                            first_name: first_name,
                            last_name: last_name,
                            admin: admin === 1 ? false : true
                        }
                        return done(null, user);

                    }
                    done(null, false, { message: errorMessage });
                });
            });
    }));

passport.serializeUser((user, done) => {
    const { id, username, first_name, last_name, admin } = user;
    done(null, { id, username, first_name, last_name, admin });
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.json({ success: false, msg: 'not Auth' })
}

const isNotAuth = (req, res, next) => {
    if (!req.isAuthenticated()) return next();
    res.json({ success: false, msg: 'is Auth' })
}

const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.admin) return next();
    res.status(401).json({ success: false, msg: 'not Admin or not Auth' })
}

const isNotAdmin = (req, res, next) => {
    if (req.isAuthenticated() && !req.user.admin) return next();
    res.json({ success: false, msg: 'is Admin or not Auth' })
}

module.exports = { mySession, passport, isAuth, isNotAuth, isAdmin, isNotAdmin };