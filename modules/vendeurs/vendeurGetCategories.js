const ServerConfig = require("../ServerConfig");
const vendeurUtils = require("./vendeurUtils");
const limitCats = ServerConfig.limit.categories;

module.exports = function vendeurGetCategories(req, res) {
    let { _id, skip, limit, exists, search } = req.body;
    if (!skip) {
        skip = 0;
    }
    if (limit && limit > limitCats) {
        limit = limitCats
    }
    vendeurUtils.getCategories({ _id, skip, exists, search }).then(catsData => {
        res.send(catsData)
    });
}