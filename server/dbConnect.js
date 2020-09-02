const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DO_USER || 'sh_jbh',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME ||'jbh_travel'
});

pool.on('connection', () => {
    console.log('mysql connecting');
});

module.exports = { pool };