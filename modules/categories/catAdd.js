const mongo = require("../db")

module.exports = function catAdd(req, res) {
    let { name } = req.body
    if (!name || name.length === 0) {
        res.send({
            error: true
        })
        return false;
    }
    let time = Date.now()
    mongo.cats.insertOne({
        name,
        time
    }, (err, insertInfo) => {
        if (err) {
            res.send({
                ok: false
            })
            return false;
        }
        res.send({
            ok: true,
            _id: insertInfo._id
        })
    })

}
