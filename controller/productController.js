const { Product, Fuel } = require("../model/Product")


// ADD NEW PRODUCT
const newProduct = async (req, res) => {
    try {
        if (!req.body.car_name) {
            return res.status(400).json({ status: 0, msg: "Title is required" })
        } else if (!req.body.car_model) {
            return res.status(400).json({ status: 0, msg: "Price is required" })
        } else if (!req.body.car_num) {
            return res.status(400).json({ status: 0, msg: "Detail is required" })
        }
        const product = new Product({
            car_name: req.body.car_name,
            car_model: req.body.car_model,
            car_num: req.body.car_num,
            car_image: req.file.path,
            userId: req.payload.user._id
        })
        const newProduct = await product.save()
        return res.status(200).json({ status: 1, msg: "Product is created", newProduct })


    } catch (error) {
        console.log(error.message);
    }
}

// SHOW ALL PRODUCTS
const allProduct = async (req, res) => {
    try {
        const products = await Product.find({ userId: req.payload.user._id })
        if (products.length <= 0) {
            return res.status(200).json({ status: 0, msg: "No Product Found" })
        } else {
            numOfProduct = products.length
            return res.status(200).json({ status: 1, Count: numOfProduct, products })
        }
    } catch (error) {
        console.log(error.message);

    }
}

// EDIT CAR DETAILS
const updateCarDetail = async (req, res) => {
    try {
        const product = await Product.findById({ _id: req.body.update_id })
        product.car_name = req.body.car_name
        product.car_model = req.body.car_model
        product.car_num = req.body.car_num
        product.car_image = req.body.car_image

        const updateProduct = await product.save()
        if (updateProduct) {
            return res.status(200).json({ status: 1, msg: "Product updated", data: updateProduct })
        } else {
            return res.status(400).json({ status: 0, msg: "Something wrong" })
        }

    } catch (error) {
        console.log(error.message);

    }
}

// ADDING FUEL API
// const addFuel = async (req, res) => {
//     try {
//         const check = await Fuel.findOneAndUpdate({ car_id: req.body.car_id }, { $push: { fuelDetail: [...req.body.fuelDetail] } })


//         if (!check) {
//             const fuel = new Fuel({
//                 car_id: req.body.car_id,
//                 fuelDetail: [...req.body.fuelDetail]
//             })
//             const newFuel = await fuel.save()
//             return res.status(201).json({ status: 1, msg: "Fuel have been added", data: newFuel })
//         }
//     } catch (error) {
//         console.log(error.message);

//         return res.status(500).json({ status: 0, msg: "not working" })

//     }
// }


// const addFuel = async (req, res) => {
//     try {

//             const news = await Fuel.findOneAndUpdate({ car_id: req.body.car_id }, { $push: { fuelDetail: [...req.body.fuelDetail] } }).populate("car_id", "car_name")
//             await news.save()


//             // const fuel = new Fuel({
//             //     car_id: req.body.car_id,
//             //     fuelDetail: [...req.body.fuelDetail]
//             // })
//             // const newFuel = await fuel.save()
//             return res.status(201).json({ status: 1, msg: "Fuel have been added", data: news })


//     } catch (error) {
//         console.log(error.message);

//     }
// }

const addFuel = async (req, res) => {
    try {
        // console.log(req.body);
        const find = await Fuel.findOne({ car_id: req.body.car_id })
        if (!find) {
            const addnew = new Fuel({
                car_id: req.body.car_id,
                fuelDetail: req.body.fuelDetail
            })
            await addnew.save()
            return res.status(201).json({ status: 1, msg: "Done", addnew })
        } else {

            const news = await Fuel.findOneAndUpdate({ car_id: req.body.car_id }, { $push: { fuelDetail: [...req.body.fuelDetail] } })
            await news.save()

            return res.status(201).json({ status: 1, msg: "Fuel have been added", data: news })
        }



        // const fuel = new Fuel({
        //     car_id: req.body.car_id,
        //     fuelDetail: [...req.body.fuelDetail]
        // })
        // const newFuel = await fuel.save()


    } catch (error) {

        console.log(error.message);
    }
}

const fuelList = async (req, res) => {
    try {
        const list = await Fuel.findOne({car_id:req.body.car_id}).populate("car_id")
        return res.status(200).json({ status: 1, msg: "List of Fuels", data: list })
    } catch (error) {
        console.log(error.message);

    }
}

module.exports = { newProduct, allProduct, updateCarDetail, addFuel, fuelList }