const dbcon = require("../dbconfig");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken")


async function Register(req, res) {
    const { firstname, lastname, username, password, email } = req.body;

    // Validate input
    if (!firstname || !lastname || !username || !password || !email) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please provide all required information" });
    }

    try {
        // Check if user already exists
        const [existingUser] = await dbcon.query("SELECT id FROM users WHERE username = ? OR email = ?", [username, email]);
        if (existingUser.length > 0) {
            return res.status(StatusCodes.CONFLICT).json({ msg: "User already exists" });
        }

        // Validate password length
        if (password.length < 8) {
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Password must be at least 8 characters long" });
        }

        // Hash password
        const salt= await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user into database
        await dbcon.query(
            "INSERT INTO users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)",
            [firstname, lastname, username, email, hashedPassword]
        );

        res.status(StatusCodes.CREATED).json({ msg: "Registered successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Internal server error" });
    }
}
async function Login(req, res) {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please provide all required information" });
    }

    try {
        // Check if user exists
        const [user] = await dbcon.query("SELECT id, username, password FROM users WHERE username = ?", [username]);
      
       //res.send(user)
       if (!user || user.length === 0) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid username or password" });
        }

        // Compare passwords
        const isValidPassword = await bcrypt.compare(password, user[0].password);
        if (!isValidPassword) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid username or password" });
        }
        const secret = process.env.JWT_SECRET
     const token = jwt.sign({ username: user[0].username, userid: user[0].id },secret, { expiresIn: "1h" });
       
     console.log(token);
     // Successful login
       return res.status(StatusCodes.OK).json({ msg: "Login successful", user: { id: user[0].id, username: user[0].username },token:token });
    } catch (err) {
        console.error(err.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Internal server error" });
    }
}



async function CheckUser(req, res) {
    const username=req.authorizedUser.username;
    const userid=req.authorizedUser.userid;
   return res.status(StatusCodes.OK).json({username:username,userid:userid });
}

module.exports = { Login, Register, CheckUser };
