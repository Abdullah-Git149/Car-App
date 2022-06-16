const User = require("../model/User")
const bcrypt = require("bcryptjs")
const { sendEmail } = require("../utils/utils")

// USER SIGN UP
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

            const verificationCode = Math.floor(10000 + Math.random() * 900000)
            const user = new User({
                user_name: req.body.user_name,
                user_email: req.body.user_email,
                user_password: req.body.user_password,
                code: verificationCode
            })

            const token = await user.generateAuthToken()
            await user.save().then(result => {
                sendEmail(user.user_email, verificationCode, "Email Verification Code")
                return res.status(201).json({ status: 1, msg: "Account has been created" + `and your verification code is ${user.code}` })

            }).catch(error => {
                res.status(400).send({
                    status: 0,
                    message: "Not working",
                    error: error.message
                });
            })

        }

    } catch (error) {
        return res.status(400).send(error);

    }
}

// USER SIGN IN
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

// VERIFY CODE 
const verifyCode = async (req, res) => {
    try {
        if (!req.body.user_id) {
            return res.status(400).json({ status: 0, msg: "User id field is required" })
        } else if (!req.body.verification_code) {
            return res.status(400).json({ status: 0, msg: "Verification code field is required" })
        }
        await User.find({ _id: req.body.user_id }).then((result) => {
            if (!req.body.verification_code) {
                return res.status(400).json({ status: 0, msg: "Verification code is required" })
            }
            if (req.body.verification_code == result[0].code) {
                User.findByIdAndUpdate({ _id: req.body.user_id }, { verified: 1, code: null }, (err, _result) => {
                    if (err) {
                        return res.status(400).json({ status: 0, msg: "Something went wrong" });
                    }
                    if (_result) {
                        return res.status(200).json({ status: 1, msg: "OTP matched" })
                    }
                })
            } else {
                return res.status(400).json({ status: 0, msg: "Verification Code not matched" })
            }
        }).catch((err) => {
            return res.status(400).json({ status: 0, msg: err.message });
        })
    } catch (error) {
        return res.status(400).send(error.message);

    }
}


// RESEND VERICICATION CODE

const resendCode = async (req, res) => {
    try {
        if (!req.body.user_id) {
            return res.status(400).json({ status: 0, msg: "User ID is required" });
        } else {
            const user = await User.find({ _id: req.body.user_id })

            const verification_code = Math.floor(100000 + Math.random() * 900000)

            const newUser = await User.findByIdAndUpdate({ _id: req.body.user_id }, { verified: 0, code: verification_code })
            if (newUser) {
                sendEmail(newUser.user_email.verificationCode, "Verification code Resend")
                return res.status(200).json({ status: 1, msg: "Verification code Resend successfully" })
            } else {
                resendCode.status(400).json({ status: 0, msg: "Something went wrong" })
            }
        }
    } catch (error) {
        return res.status(400).send(error.message);

    }
}

// FORGET PASSWORD

const forgetPassword = async (req, res) => {
    try {
        if (!req.body.user_email) {
            return res.status(400).json({ status: 0, msg: "Email is required" });
        } else {
            const user = await User.find({ user_email: req.body.user_email })
            if (!user) {
                return res.status(400).json({ status: 0, msg: "User not found" });
            } else {
                console.log(user[0]);

                const verification_code = Math.floor(100000 + Math.random() * 900000)

                const newUser = await User.findByIdAndUpdate({ _id: user[0]._id }, { code: verification_code })
                if (newUser) {
                    sendEmail(user[0].user_email, verification_code, "Forget password")
                    res.status(200).json({ status: 1, msg: "Code successfully send to email" + verification_code })
                } else {
                    res.status(400).json({ status: 1, msg: "Something went wrong" })
                }
            }
        }
    } catch (error) {
        return res.status(400).send(error.message);

    }
}

const updatePassword = async (req, res) => {
    try {
        if (!req.body.user_id) {
            return res.status(400).json({ status: 0, msg: "User ID is wrong" })
        } else if (!req.body.newPassword) {
            return res.status(400).json({ status: 0, msg: "New password is required" })
        } else {
            const user = await User.find({ _id: req.body.user_id })
            if (!user) {
                return res.status(400).json({ status: 0, msg: "User not found" })
            } else {
                bcrypt.hash(req.body.newPassword, 10, (error, hash) => {
                    if (error) {
                        return res.status(400).json({ msg: "Something went wrong", error: error.message })
                    } else {
                         User.findByIdAndUpdate({ _id: req.body.user_id }, { user_password: hash }, (err, result) => {
                            if (err) {
                                res.status(400).json({ status: 0, msg: "Something went wrong", error: err.message })
                            }
                            if (result) {
                                return res.status(200).json({ status: 1, msg: "Password updated successfully" })
                            }
                        })
                    }
                })
            }
        }
    } catch (error) {
        return res.status(400).send(error.message);

    }
}

module.exports = { signUp, signIn, verifyCode, resendCode, forgetPassword ,updatePassword}