const jwt = require("jsonwebtoken");

const JWT_SECRET = "asdasdjlk90"; // ใส่ค่า SECRET ตรงนี้เลย

const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "1h",
    });
};

module.exports = { generateToken };
