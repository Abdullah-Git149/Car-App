const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    car_name: {
        type: String,
        trim: true,
        default: null
    },
    car_model: {
        type: String,
        trim: true,
        default: null
    },
    car_num: {
        type: Number,
        trim: true,
        default: null
    },
    car_image: {
        type: String,
        trim: true,
        default: null
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "User"
    }
})



const fuelSchema = mongoose.Schema({
    fuelDetail: [{
        price: { type: Number, required: false },
        liter: { type: Number, required: false },
        fuelDate: { type: Date, required: false }
    }],
    car_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Product"
    }
}, { timestamps: true })
const Product = mongoose.model("Product", productSchema)
const Fuel = mongoose.model("Fuel", fuelSchema)
module.exports = { Product, Fuel }