const ServerConfig = require("../ServerConfig");
const vendeurUtils = require("./vendeurUtils");
const limitArticle = ServerConfig.limit.articles;

module.exports = function vendeurGetInvoice(req, res) {
    let { _id } = req.body;

    const invoice = {};
    vendeurUtils.getArticles({
        _id,
        skip: 0,
        limit: Number.MAX_SAFE_INTEGER,
        exists: true,
        notZero: true,
    }).then(info => {
        invoice.articles = info.articles;
        res.send(invoice);
    });
}