const express = require('express');
const router = express.Router();
const { pool } = require('../dbConnect');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { mySession, passport, isAuth, isNotAuth } = require('../authenticate/authenticate');
const { checkUsername, checkName, checkPassword } = require('../validations');

router.use(mySession)
router.use(passport.initialize());
router.use(passport.session());

router.post('/register', isNotAuth, (req, res) => {
    const { firstName, lastName, username, password } = req.body;

    // input validation
    const validations = [];
    const checkUsernameRes = checkUsername(username);
    if (checkUsernameRes) validations.push(checkUsernameRes);

    const checkFirstNameRes = checkName(firstName, 'First Name');
    if (checkFirstNameRes) validations.push(checkFirstNameRes);

    const checkLastNameRes = checkName(lastName, 'Last Name');
    if (checkLastNameRes) validations.push(checkLastNameRes);

    const checkPasswordRes = checkPassword(password);
    if (checkPasswordRes) validations.push(checkPasswordRes);

    if (validations.length) {
        return res.status(400).json({ success: false, msg: validations });
    }

    //register
    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) throw err;

        bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;

            pool.query(`INSERT INTO users(first_name, last_name, user_name, password, permission)
            VALUES (?,?,?,?,1)`,
                [firstName, lastName, username, hash],
                (err, results) => {
                    if (err || results.affectedRows < 1) {
                        if (err.code === 'ER_DUP_ENTRY') {
                            return res.status(400).json({ success: false, msg: 'UserName already exist' });
                        }
                        return res.status(400).json({ success: false, msg: 'Registration failed' });
                    }

                    res.json({ success: true });
                });
        });
    });
});

router.get('/checkusername/:username', isNotAuth, (req, res) => {
    const { username } = req.params;

    // input validation
    const checkUsernameRes = checkUsername(username);
    if (checkUsernameRes) return res.json({ success: false, msg: checkUsernameRes });

    //check if exist
    pool.query(`SELECT user_name FROM users WHERE user_name=?`,
        [username],
        (err, results) => {
            if (err) throw err;
            if (results.length) return res.json({ success: true }); //exist
            res.json({ success: false }); //not exist
        });
});

router.post('/login', isNotAuth, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) {
            return res.status(401).json({ success: false, msg: info.message })
        }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            res.json({ success: true, msg: user });
        });
    })(req, res, next);
});

router.get('/isAuth', isAuth, (req, res) => {
    res.json({ success: true, msg: req.user });
});

router.post('/logout', isAuth, (req, res) => {
    req.logout();
    res.json({ success: true });
});

module.exports = router;