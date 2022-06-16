const multer = require("multer")
const nodemailer = require("nodemailer");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname == "car_image") {
            cb(null, './upload')
        }
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)

    }
})

function fileFilter(req, file, cb) {
    cb(null, true)
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }

}

const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})


// ========= NODE MAILER =================================

var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "458eedd80819d8",
        pass: "10d673c1a0469e"
    }
})

const sendEmail = (email, verificationCode, subject) => {
    const mailOptions = {
        from: "noreply@server.appsstaging.com",
        to: email,
        subject: subject,
        html: `<p>Your verification code is ${verificationCode} </p>`
    }
    transporter.sendMail(mailOptions, function (err, result) {
        if (err) console.log(err)
        else console.log(result);
    })
}

module.exports = { upload, sendEmail }