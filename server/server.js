const express = require('express');
const app = express();
const http = require('http').createServer(app);
module.exports = { http };
const path = require('path');
const cors = require('cors');
const port = process.env.PORT || 3000;
const user = require('./route/user')
const vacations = require('./route/vacations')
const admin = require('./route/admin')

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}));

app.use(express.json());
app.use('/user', user);
app.use('/vacations', vacations);
app.use('/admin', admin);
app.use('/', express.static(path.join(__dirname, 'client/build')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Capturing errors
app.use((err, req, res, next) => {
    console.log(err);
    if (err) return res.sendStatus(500);
    next();
});

http.listen(port, () => console.log(`Server running on port ${port}`));