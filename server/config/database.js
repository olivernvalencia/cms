import mysql from 'mysql';

const db = mysql.createConnection({
    host: 'localhost',
    port: '3307',
    user: 'root',
    password: 'root',
    database: 'dbcbs',
});

db.connect((err) => {
    if (err) console.log("Database Error");
    return console.log("Connected")
});

export default db;