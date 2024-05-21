const debitClient = require("./debitClient");
const debitCount = require("./debitCount");
const debitInvoice = require("./debitInvoice");
const debitInvoices = require("./debitInvoices");
const debitSellers = require("./debitSellers");

const debitIndex = {
    count: debitCount,
    getSellers: debitSellers,
    getClients: debitClient,
    getInvoices: debitInvoices,
    getInvoice: debitInvoice,
};

module.exports = debitIndex;