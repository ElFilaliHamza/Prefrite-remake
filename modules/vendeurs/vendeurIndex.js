const addVendeur = require("./addVendeur");
const vendeurAddArticle = require("./vendeurAddArticle");
const vendeurGet = require("./vendeurGet");
const vendeurGetArticles = require("./vendeurGetArticles");
const vendeurGetCategories = require("./vendeurGetCategories");
const vendeurGetClients = require("./vendeurGetClients");
const vendeurGetInvoice = require("./vendeurGetInvoice");
const vendeurGetOne = require("./vendeurGetOne");
const vendeurHandPayment = require("./vendeurHandPayment");
const vendeurRemoveArticle = require("./vendeurRemoveArticle");
const vendeurStats = require("./vendeurStats");
const { vendeurUpdateArticleReq } = require("./vendeurUpdateArticle");

const vendeurIndex = {
    add: addVendeur,
    get: vendeurGet,
    getOne: vendeurGetOne,
    getArticles: vendeurGetArticles,
    getCategories: vendeurGetCategories,
    getClients: vendeurGetClients,
    addArticle: vendeurAddArticle,
    removeArticle: vendeurRemoveArticle,
    updateArticle: vendeurUpdateArticleReq,
    getStats: vendeurStats,
    handPayment: vendeurHandPayment,
    getInvoice: vendeurGetInvoice
}

module.exports = vendeurIndex;