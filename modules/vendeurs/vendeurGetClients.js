const ServerConfig = require("../ServerConfig");
const vendeurUtils = require("./vendeurUtils");
const limitArticle = ServerConfig.limit.articles;

module.exports = function vendeurGetClients(req, res) {
    let { _id, skip } = req.body;
    if (!skip) {
        skip = 0;
    }

    vendeurUtils.getClients({ _id, skip }).then(clientsData => {
        res.send(clientsData);
    });
}