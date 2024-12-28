const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const dbcon = require("./dbconfig");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route middleware
app.use("/api/user", userRoutes);
const PORT = process.env.PORT || 3000; // Fallback to 3000 if PORT is undefined



// Test database connection
async function start() {
    try {
      app.listen(PORT, (error) => {
        if (error) {
            console.error("Failed to start the server:", error.message);
        } else {
            console.log("Server running on port " + PORT);
        }
    });
        const result = await dbcon.connect("select 'test'");
        console.log("Database connected successfully");
    } catch (err) {
        console.error("Error connecting to the database:", err.message);
        process.exit(1); // Exit if database connection fails
    }
}
start();


// Multer setup for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = process.env.UPLOAD_PATH || './Document/uploads';
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
        cb(null, uniqueName);
    }
});

// File validation for type and size
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'));
        }
        cb(null, true);
    }
});

// Upload route
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded!' });
        }

        const file = req.file.filename;

        // Insert file data into the database
        const sql = 'INSERT INTO Document(documet) VALUES(?)';
        dbcon.query(sql, [file], (err) => {
            if (err) {
               // console.error('Database insertion error:', err);
                return res.status(500).json({ message: 'Database error' });
            }else console.log('File uploaded:', req.file);
              });
              return res.status(200).json({ message: 'The file uploaded successfully!' });
    
    } catch (err) {
        console.error('Error handling file upload:', err.message);
      return  res.status(500).json({ message: 'Internal server error' });
    }
});

// Error handling middleware for multer
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Multer error: ${err.message}` });
    }
    if (err.message) {
        return res.status(400).json({ message: err.message });
    }
    next(err);
});

// Route to get images
app.get("/", (req, res) => {
    const sql = "SELECT * FROM `img_upload`";
    dbcon.query(sql, (err, result) => {
        if (err) {
            console.error("Database retrieval error:", err);
            return res.status(500).send('Database error');
        }
        res.json(result);
    });
});

// Serve static files from the 'public' directory
//app.use(express.static("public"));

// // Nodemailer setup
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true, // Use SSL
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.APP_PASS,
//     },
// });

// // Email endpoint
// app.post("/send-email", (req, res) => {
//     const { name, email, message } = req.body;

//     const mailOptions = {
//         from: email,
//         to: process.env.EMAIL_USER,
//         subject: `Message from ${name}`,
//         text: message,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.error("Error sending email:", error);
//             return res.status(500).json({ error: "Failed to send message" });
//         } else {
//             res.status(200).json({ message: "Message sent successfully" });
//         }
//     });
// });

// // Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// // Default error handler
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send("Something went wrong!");
// });
