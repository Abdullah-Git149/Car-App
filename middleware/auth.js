const User = require("../model/User")
const jwt = require("jsonwebtoken")
const auth = async (req, res, next) => {
    if (!req.headers['authorization']) {
        return res.status(400).json({ status: 0, msg: "Unauthorzied" })
    }
    const authHeader = req.headers['authorization']

    const bearer = authHeader.split(' ')

    const token = bearer[1]
    
    jwt.verify(token, process.env.KEY, (err, user) => {
        if (err) {
            const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message
            return res.status(400).json({ status: 0, message: message })
        }
        req.payload = user
        next()
    })
}

module.exports = auth