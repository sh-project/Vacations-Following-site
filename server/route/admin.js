const express = require('express');
const router = express.Router();
const { pool } = require('../dbConnect');
const { v4: uuid4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const { mySession, passport, isAdmin } = require('../authenticate/authenticate');
const { checkName, checkNumber, checkImage, checkFileName, checkFreeText, checkOptionalFreeText, checkRequiredDate } = require('../validations');

router.use(mySession)
router.use(passport.initialize());
router.use(passport.session());
router.use(isAdmin);

const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (!['.svg', '.png', '.jpeg', '.jpg'].includes(ext)) {
            return cb(new Error('file ext disallowed'));
        }
        cb(null, uuid4() + ext);
    }
});
const upload = multer({ storage: storage });

router.post('/addvacation', upload.single('cover'), (req, res) => {
    const { destination, slogan, description, date_from, date_to, price } = req.body;
    const { filename: image } = req.file;

    // input validation
    const validations = [];

    const checkDestination = checkName(destination, 'destination');
    if (checkDestination) validations.push(checkDestination);

    const checkSlogan = checkFreeText(slogan, 'slogan');
    if (checkSlogan) validations.push(checkSlogan);

    const checkDescription = checkOptionalFreeText(description, 'description');
    if (checkDescription) validations.push(checkDescription);

    const checkDateFrom = checkRequiredDate(date_from, 'Date From');
    if (checkDateFrom) validations.push(checkDateFrom);

    const checkDateTo = checkRequiredDate(date_to, 'Date To');
    if (checkDateTo) validations.push(checkDateTo);

    const checPrice = checkNumber(price, 'price');
    if (checPrice) validations.push(checPrice);

    const checFile = checkImage(req.file);
    if (checFile) validations.push(checFile);

    //is dateTo agter dateFrom
    if (date_to < date_from) validations.push('End date, must be after the start date');

    if (validations.length) {
        return res.status(400).json({ success: false, msg: validations });
    }

    //add
    pool.query(`INSERT INTO vacations(destination, slogan, image, description, date_from, date_to, price)
            VALUES (?,?,?,?,?,?,?)`,
        [destination, slogan, image, description, date_from, date_to, price],
        (err, results) => {
            if (err || results.affectedRows < 1) {
                return res.status(400).json({ success: false, msg: 'Failed to add vacation' });
            }
            res.json({ success: true, msg: { image: image, id: results.insertId } });
        });
});

const unlinkFile = (file, newFile, callback) => {
    const filePath = path.join(__dirname, '../uploads', file);

    fs.stat(filePath, (err) => {
        if (err) {
            callback({ success: true, msg: 'request completed. But the image did not exist' });
            return
        }

        fs.unlink(filePath, (err) => {
            if (err) {
                callback({ success: true, msg: 'request completed. But the image did not exist' });
                return
            }
            callback({ success: true, image: newFile, msg:  'request completed' });
        });
    });
}

router.post('/editvacation', upload.single('cover'), (req, res) => {
    const { id, destination, slogan, description, date_from, date_to, price, replaceImage, image: oldImage } = req.body;
    let image = '';
    if (req.file) { image = req.file.filename }

    // input validation
    const validations = [];
    const checId = checkNumber(id, 'id')
    if (checId) validations.push(checId);

    const checkDestination = checkName(destination, 'destination');
    if (checkDestination) validations.push(checkDestination);

    const checkSlogan = checkFreeText(slogan, 'slogan');
    if (checkSlogan) validations.push(checkSlogan);

    const checkDescription = checkOptionalFreeText(description, 'description');
    if (checkDescription) validations.push(checkDescription);

    const checkDateFrom = checkRequiredDate(date_from, 'Date From');
    if (checkDateFrom) validations.push(checkDateFrom);

    const checkDateTo = checkRequiredDate(date_to, 'Date To');
    if (checkDateTo) validations.push(checkDateTo);

    const checPrice = checkNumber(price, 'price');
    if (checPrice) validations.push(checPrice);

    //is dateTo agter dateFrom
    if (date_to < date_from) validations.push('End date, must be after the start date');

    if (validations.length) {
        return res.status(400).json({ success: false, msg: validations });
    }

    //edit
    if (replaceImage === 'true') {
        pool.query(`UPDATE vacations
        SET destination = ?,
            slogan = ?,
            image = ?,
            description = ?,
            date_from = ?,
            date_to = ?,
            price = ?
        WHERE id = ?`,
            [destination, slogan, image, description, date_from, date_to, price, id],
            (err, results) => {
                if (err || results.affectedRows < 1) {
                    return res.status(400).json({ success: false, msg: 'Failed to edit vacation' });
                }
                //unlink Image
                unlinkFile(oldImage, image, function (response) {
                    res.json(response);
                });
            });
    } else {
        pool.query(`UPDATE vacations
            SET destination = ?,
                slogan = ?,
                description = ?,
                date_from = ?,
                date_to = ?,
                price = ?
            WHERE id = ?`,
            [destination, slogan, description, date_from, date_to, price, id],
            (err, results) => {
                if (err || results.affectedRows < 1) {
                    return res.status(400).json({ success: false, msg: 'Failed to edit vacation' });
                }
                return res.json({ success: true, msg: 'The vacation was successfully updated, with no image replacement.' });
            });
    }
});

router.post('/deletevacation', (req, res) => {
    const { vacation, image, unlinkImage } = req.body;

    // input validation
    const validations = [];
    const checkNumberAnswer = checkNumber(vacation, 'vacation');
    if (checkNumberAnswer) validations.push(checkNumberAnswer);

    const checkFileNameAnswer = checkFileName(image);
    if (checkFileNameAnswer) validations.push(checkFileNameAnswer);

    if (validations.length) {
        return res.status(400).json({ success: false, msg: validations });
    }

    //delete vacation
    pool.query(`DELETE FROM vacations
                WHERE id = ?`, [vacation],
        (err, results) => {
            if (err || results.affectedRows < 1) {
                return res.status(400).json({ success: false, msg: 'delete vacation failed' });
            }
            //unlink Image
            if (unlinkImage) {
                unlinkFile(image, '', function (response) {
                    res.json(response);
                });
            }
            else {
                res.json({ success: true, msg: 'The vacation was deleted successfully' });
            }
        });
});

module.exports = router;