const mongo = require("../db")

module.exports = function catAdd(req, res) {
    let { _id, name } = req.body
    if (!name || name.length === 0) {
        res.send({
            error: true
        })
        return false;
    }
    mongo.cats.updateOne({
        _id: mongo.mongoID(_id)
    }, {
        $set: {
            name
        }
    }, (err, updateInfo) => {
        if (err) {
            res.send({
                ok: false
            })
            return false;
        }
        res.send({
            ok: true,
        })
    })

}
