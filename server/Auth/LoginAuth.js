const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

async function LoginAuth(req, res,nextRout) {
    const authHeader = req.headers.authorization;

    // Check if the Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Authorization invalid" });
    }

    // Extract the token
    const token = authHeader.split(" ")[1]; // Get the token after 'Bearer'

    try {
        // Verify the token
        const secret = process.env.JWT_SECRET
        const {username,userid} = jwt.verify(token, secret);

        req.authorizedUser={username,userid} ;
        //console.log(req.authorizedUser);
        nextRout()

      

        // Return the decoded token data
        //return res.status(StatusCodes.OK).json({ tokendata });
    } catch (err) {
        console.error("JWT verification error:", err.message);

        // Handle specific JWT errors (optional)
        if (err.name === "TokenExpiredError") {
            return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Token expired" });
        } else if (err.name === "JsonWebTokenError") {
            return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid token" });
        }

        // Generic error response
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Authorization invalid" });
    }
}

module.exports = LoginAuth;
