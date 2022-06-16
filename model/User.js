const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const userSchema = mongoose.Schema({
    user_name: {
        type: String,
        trim: true,
        default: null
    },
    user_email: {
        type: String,
        trim: true,
        default: null
    },
    user_password: {
        type: String,
        trim: true,

    },
    image: {
        type: String,
        default: null
    },
    user_authentication: {
        type: String,
        default: null,
        required: false
    }, code: {
        type: Number,
        default: null
    },
    verified: {
        type: Number,
        default: 0
    },
    is_blocked: {
        type: Number,
        default: 0
    },
},
    {
        timestamps: true
    })


// GENERATING TOKEN FOR USER
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = await jwt.sign({ user }, process.env.KEY)
    user.user_authentication = token
    await user.save()
    return token
}

// HASHING THE PASSWORD
userSchema.pre("save", async function (next) {
    const user = this
    if (user.isModified("user_password")) {
        user.user_password = await bcrypt.hash(user.user_password, 8)
    }
    next()
})
const User = mongoose.model("User", userSchema)

module.exports = User