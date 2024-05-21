const addAdmin = require("./addAdmin");
const adminAlerts = require("./adminAlerts");
const adminGetAdmins = require("./adminGetAdmins");
const userLogin = require("./adminLogin");

module.exports = {
    userLogin,
    adminAlerts,
    getAdmins: adminGetAdmins,
    addAdmin: addAdmin,
}