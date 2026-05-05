import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '', // Fallback to empty string
    database: process.env.DB_NAME,
});

db.connect((err) => {
    console.log(err);
    if (err) console.log("Database Error");
    return console.log("Connected")
});

export default db;