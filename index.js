const express = require("express")
const app = express()
const connect = require("./db/db")
const userRouter = require("./router/userRouter")
const productRouter = require("./router/productRouter")
require("dotenv").config()

app.use(express.json())

app.use(userRouter)
app.use(productRouter)
const PORT = 5000

connect()
app.listen(PORT, (req, res) => {
    console.log(`Connection running on ${PORT}`);
})