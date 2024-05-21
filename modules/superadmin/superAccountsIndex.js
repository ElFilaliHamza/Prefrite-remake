const superAccountsGet = require("./superAccountsGet");
const superAccountsUpdate = require("./superAccountsUpdate");
const superCreateAccount = require("./superCreateAccount");
const superDeleteAccount = require("./superDeleteAccount");

module.exports = {
    create: superCreateAccount,
    delete: superDeleteAccount,
    get: superAccountsGet,
    update: superAccountsUpdate
}