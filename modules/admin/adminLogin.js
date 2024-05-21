const mongo = require("../db");
const crypto = require('crypto');

module.exports = function adminLogin(req, res) {
    let { username, password } = req.body;
    mongo.admin.findOne({
        username: username
    }, (err, info) => {
        if (err || !info) {
            res.send({
                error: true
            });
            return false;
        }

        //const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        if (password === info.password) {
            req.session.admin = info._id.toString();
            res.send({
                logged: true
            });
        } else {
            res.send({
                error: true
            })
        }
    })
}