const express = require("express")
const router = express.Router()

const { signUp, signIn } = require("../controller/userController")

router.post("/api/signUp", signUp)
router.post("/api/signIn", signIn)

module.exports = router