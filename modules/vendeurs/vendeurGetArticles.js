const ServerConfig = require("../ServerConfig");
const vendeurUtils = require("./vendeurUtils");
const limitArticle = ServerConfig.limit.articles;

module.exports = function vendeurGetArticles(req, res) {
    let { _id, skip, limit, exists, catId, search } = req.body;
    if (!skip) {
        skip = 0;
    }
    if (limit && limit > limitArticle) {
        limit = limitArticle
    }
    vendeurUtils.getArticles({ _id, skip, limit, exists, catId, search }).then(artsData => {
        res.send(artsData)
    });
}