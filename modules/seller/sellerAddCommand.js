const mongo = require("../db");
const ServerConfig = require("../ServerConfig");

module.exports = async function sellerAddCommand(req, res) {
    const { sellerId } = req.session;
    if (!sellerId) {
        res.send({ access: false });
        return false;
    }

    const { articles } = req.body;

    mongo.cmd.aggregate([
        {
            $match: {
                sellerId: sellerId,
                fullfiled: {
                    $exists: false
                }
            }
        }
    ], (err, data) => {
        if (Array.isArray(articles)) {
            const map = {};
            //add new articles
            for (let art of articles) {
                map[art._id] = (map[art._id] || 0) + art.qt
            }
            //add old articles
            for (let info of data) {
                let articles = info.articles;
                for (let art of articles) {
                    map[art._id] = (map[art._id] || 0) + art.qt
                }
            }
            let newArticles = Object.entries(map).map(([key, value]) => {
                return {
                    _id: key,
                    qt: value
                }
            })
            mongo.cmd.updateOne({
                sellerId: sellerId,
                fullfiled: {
                    $exists: false
                }
            }, {
                $set: {
                    articles: newArticles,
                    time: Date.now()
                }
            }, {
                upsert: true,
            }, (err, info) => {
                res.send({
                    ok: true
                });
            })
        }
    });
}