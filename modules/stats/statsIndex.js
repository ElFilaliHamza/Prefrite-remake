const getToPay = require("./getToPay");
const paymentsHistory = require("./paymentsHistory");

const statsIndex = {
    getToPay: getToPay,
    getHistory: paymentsHistory,
};
module.exports = statsIndex;