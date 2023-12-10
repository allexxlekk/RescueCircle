const jwt = require('jsonwebtoken');

// Middleware to verify JWT tokens

function verifyJwtToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    try {
        const secretKey = "mysecretkey";

        // Verify the token and decode its payload
        //TODO make it a .env variable
        req.user = jwt.verify(token, secretKey);

        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = verifyJwtToken;