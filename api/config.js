const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'shoptar'
});

db.connect((err) =>{
    if(err){
        console.error('error connecting',err.stack);
        return;
    }
    console.log('connected..')
});

module.exports = db;