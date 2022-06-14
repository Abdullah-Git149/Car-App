const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const { newProduct, allProduct, fuelList, updateCarDetail, addFuel } = require("../controller/productController")

router.post("/api/newProduct", auth, newProduct)
router.get("/api/showProduct", auth, allProduct)
router.put("/api/update-product", auth, updateCarDetail)
router.post("/api/add-fuel", addFuel)
router.get("/api/list-of-fuel", fuelList)

module.exports = router