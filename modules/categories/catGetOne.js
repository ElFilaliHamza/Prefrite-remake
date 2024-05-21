const { artGet } = require("../articles/artGet")
const mongo = require("../db")

const limitArticle = 10

module.exports = function catGetOne(req, res) {

    let { _id } = req.body

    try {
        const catMongoID = mongo.mongoID(_id)
        mongo.cats.findOne({
            _id: catMongoID
        }, {}, async (err, info) => {
            if (err || !info) {
                res.send(null)
                return false
            }

            const data = await artGet({ catId: _id });
            info.endArticles = data.endArticles
            const articles = data.data;
            res.send({
                info,
                articles
            })
        })
    } catch (error) {
        res.send(null)
    }

}