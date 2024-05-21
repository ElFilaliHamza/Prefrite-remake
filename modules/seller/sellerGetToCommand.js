const mongo = require("../db");
const ServerConfig = require("../ServerConfig");
const articleProject = ServerConfig.project.articles;

module.exports = async function sellerGetToCommand(req, res) {
    const { sellerId } = req.session;
    if (!sellerId) {
        res.send({ access: false });
        return false;
    }

    let categories = await new Promise(resolve => {
        mongo.cats.find({}, (err, data) => {
            resolve(data || []);
        });
    });

    let articles = await new Promise(resolve => {
        mongo.arts.find({}, {
            ...articleProject,
            sellerQt: `$vendeurs.${sellerId}.qt`
        }, (err, data) => {
            resolve(data || []);
        });
    });


    /* //filter to get only full categories
    categories = categories.filter(cat => articles.find(art => {
        return art.catId === cat._id.toString();
    })) */

    res.send({
        categories,
        articles
    })
}