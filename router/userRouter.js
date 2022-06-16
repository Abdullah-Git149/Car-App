const express = require("express")
const router = express.Router()

const { signUp, signIn, verifyCode, resendCode, forgetPassword, updatePassword } = require("../controller/userController")

router.post("/api/signUp", signUp)
router.post("/api/signIn", signIn)
router.post("/api/verify-user", verifyCode)
router.post("/api/resend-code", resendCode)
router.post("/api/forget-password", forgetPassword)
router.post("/api/update-password", updatePassword)

module.exports = router