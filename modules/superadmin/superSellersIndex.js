const superAccountsUpdate = require("./superAccountsUpdate");
const superSellersGet = require("./superSellersGet");
const superSellersGetOne = require("./superSellersGetOne");
const superSellersUpdateCharges = require("./superSellersUpdateCharges");

module.exports = {
    get: superSellersGet,
    getOne: superSellersGetOne,
    updateCharges: superSellersUpdateCharges,
    update: superAccountsUpdate,
}