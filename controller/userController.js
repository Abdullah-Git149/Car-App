const User = require("../model/User")
const bcrypt = require("bcryptjs")
const signUp = async (req, res) => {
    try {
        if (!req.body.user_name) {
            return res.status(404).json({ status: 0, msg: "User full name is required" })
        } else if (!req.body.user_email) {
            return res.status(404).json({ status: 0, msg: "User Email is required" })
        } else if (!req.body.user_password) {
            return res.status(404).json({ status: 0, msg: "User Password is required" })
        }

        const check = await User.findOne({ user_email: req.body.user_email })
        if (check) {
            return res.status(400).json({ status: 0, msg: "Please user another Email" })
        } else {

            const user = new User({
                user_name: req.body.user_name,
                user_email: req.body.user_email,
                user_password: req.body.user_password
            })
            const token = await user.generateAuthToken()
            const newUser = await user.save()

            return res.status(201).json({ status: 1, msg: "Account has been created", userData: newUser, token })
        }

    } catch (error) {
        return res.status(400).send(error);

    }
}

const signIn = async (req, res) => {
    try {
        if (!req.body.user_email) {
            return res.status(400).json({ status: 1, msg: "Email required" })
        } else if (!req.body.user_password) {
            return res.status(400).json({ status: 1, msg: "Password required" })
        }

        const user = await User.findOne({ user_email: req.body.user_email })
        if (!user) {
            return res.status(400).json({ status: 0, msg: "Email not found" })
        } else {
            const isMatch = await bcrypt.compare(req.body.user_password, user.user_password)
            if (!isMatch) {
                return res.status(400).json({ status: 0, msg: "Incorrect Password" })
            } else {
                const token = await user.generateAuthToken()
                return res.status(200).json({ status: 1, msg: `${user.user_name} has been login`, token })
            }
        }

    } catch (error) {
        return res.status(400).send(error);

    }
}

module.exports = { signUp, signIn }