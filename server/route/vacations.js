const express = require('express');
const router = express.Router();
const { pool } = require('../dbConnect');
const { mySession, passport, isAuth, isNotAdmin } = require('../authenticate/authenticate');
const { checkNumber } = require('../validations');
const { http } = require('../server');
const io = require('socket.io')(http);

router.use(mySession)
router.use(passport.initialize());
router.use(passport.session());
router.use(isAuth);

//socket io
io.use((socket, next) => {
    mySession(socket.request, {}, next);
});

io.use((socket, next) => {
    const { passport: passportSession } = socket.request.session;
    if (passportSession) {
        if (passportSession.user) {
            return next();
        }
        return socket.disconnect();
    }
    socket.disconnect();
});

io.on('connection', (socket) => {
    console.log(`New connection id ${socket.id}`); //Teacher consent to leave.

    socket.on('fromClient', (data) => {

        io.emit('toClient', data);

        socket.on('disconnect', () => {
            console.log(`Connection id ${socket.id} disconnected!`); //Teacher consent to leave.
        });
    });
})

//express router
router.get('/', (req, res) => {
    const { id } = req.user;

    pool.query(`SELECT v.id, v.destination, v.slogan, v.image,
                    v.description,
                    DATE_FORMAT(v.date_from, "%d/%m/%Y") AS date_from,
                    DATE_FORMAT(v.date_to, "%d/%m/%Y") AS date_to,
                    v.price,
                    count(f.user) as followers,
                    fu.user as userfollow
                FROM vacations AS v
                LEFT JOIN follow AS f ON (v.id = f.vacation)
                LEFT JOIN follow AS fu ON (v.id = fu.vacation) and fu.user = ?
                GROUP BY v.id
                ORDER BY userfollow DESC, v.id;`, [id],
        (err, results) => {
            if (err) throw err;
            if (results.length) return res.json({ success: true, msg: results });
            res.json({ success: false, msg: 'No vacations' });
        });
});

router.post('/follow', isNotAdmin, (req, res) => {
    const { id: user } = req.user;
    const { vacation } = req.body;

    const checkNumberAnswer = checkNumber(vacation, 'vacations')
    if (checkNumberAnswer) {
        return res.status(400).json({ success: false, msg: checkNumberAnswer });
    }

    pool.query(`INSERT INTO follow(vacation, user)
    VALUES (?, ?)`, [vacation, user],
        (err, results) => {
            if (err || results.affectedRows < 1) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ success: false, msg: 'The user is already following' });
                }
                if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                    return res.status(400).json({ success: false, msg: 'The vacation does not exist' });
                }
                return res.status(400).json({ success: false, msg: 'following failed' });
            }

            res.json({ success: true });
        });
});

router.post('/unfollow', isNotAdmin, (req, res) => {
    const { id: user } = req.user;
    const { vacation } = req.body;

    const checkNumberAnswer = checkNumber(vacation, 'vacation')
    if (checkNumberAnswer) {
        return res.status(400).json({ success: false, msg: checkNumberAnswer });
    }

    pool.query(`DELETE FROM follow
                WHERE vacation = ? AND user = ?`, [vacation, user],
        (err, results) => {
            if (err || results.affectedRows < 1) {
                return res.status(400).json({ success: false, msg: 'unfollow failed' });
            }

            res.json({ success: true });
        });
});

module.exports = router;