const multer = require('multer')
const path = require('path')
const fs = require('fs')

const { generateFileName } = require('./ServerUtils')
const { UPLOAD_PATH } = require('./ServerConfig')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_PATH)
    },
    filename: function (req, file, cb) {
        let name = generateFileName(UPLOAD_PATH, path.extname(file.originalname))
        //req.fileTmpName = name
        cb(null, name)
    }
});

var multerUpload = multer({
    storage: storage
})

var upload = multerUpload.single('img');

module.exports = upload