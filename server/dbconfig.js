const mysql = require("mysql2");
require("dotenv").config();

const dbcon = mysql.createConnection({
    user: process.env.db_USER,
    password: process.env.db_PASSWORD,
    host: process.env.db_HOST, // Ensure DB_HOST matches your .env file
    database: process.env.db // database
});

// Test connection pool by querying the database
// dbcon.query("SELECT 1", (err, results) => {
//     if (err) {
//         console.error("Error connecting to the database:", err.message);
//     } else {
//         console.log("Database connected successfully, test query result:", results);
//     }
// });

// Uncomment to use Promises with async/await
module.exports = dbcon.promise();

// Debug: Verify environment variables
console.log("DB_HOST:", process.env.db_HOST);
console.log("USERNAME:", process.env.db_USER);
console.log("PASSWORD:", process.env.db_PASSWORD);
console.log("MYDATABASE:", process.env.db_HOST);

