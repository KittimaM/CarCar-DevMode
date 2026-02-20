const mysql = require("mysql2");

const Conn = mysql.createPool({
  host: process.env.DB_HOST,
<<<<<<< HEAD
  port: process.env.DB_PORT,
=======
  port: process.env.DB_PORT,
>>>>>>> origin/main
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = Conn;
