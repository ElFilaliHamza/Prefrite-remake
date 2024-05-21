const fs = require('fs');
const { UPLOAD_PATH } = require('./ServerConfig');

function serveImage(req, res){
    let filename = req.params.name
    let filepath = UPLOAD_PATH + filename
    if(fs.existsSync(filepath)){
        res.sendFile(filepath);
    } else {
        res.status(404).send(null);
    }
}

module.exports = {
    serveImage
}