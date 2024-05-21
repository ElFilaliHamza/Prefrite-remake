const { vendeurUpdateArticle } = require("./vendeurUpdateArticle");

module.exports = function vendeurAddArticle(req, res) {
    vendeurUpdateArticle(req.body).then(info => {
        res.send(info);
    })
}
