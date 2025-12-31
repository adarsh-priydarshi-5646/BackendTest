const jwt = require('jsonwebtoken')
const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token){
            return res.status(401).json({ message: "no token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userID
        req.role = decoded.role
        next();

    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = protect;