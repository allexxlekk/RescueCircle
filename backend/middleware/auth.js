const {verify} = require("jsonwebtoken");


// Middleware to verify JWT tokens

function authenticateToken(req, res, next) {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1] || null;

    if (!token) {
        req.authenticated = false;
        return next();
    }

    try {
        req.user = verify(token, process.env.JWT_SECRET);
        req.authenticated = true;
        next();
    } catch (error) {
        req.authenticated = false;
        res.clearCookie('token');
        next();
    }
}

module.exports = authenticateToken;
