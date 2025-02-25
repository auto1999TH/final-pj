const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const JWT_SECRET = "asdasdjlk90";

    if (!token) return res.status(401).json({ error: "Access denied, token missing!" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token!" });

        req.user = user; 
        next(); 
    });
};

module.exports = authenticateToken;
