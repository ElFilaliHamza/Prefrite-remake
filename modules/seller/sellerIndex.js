const sellerAddCommand = require("./sellerAddCommand");
const sellerBuy = require("./sellerBuy");
const sellerGetAllInfo = require("./sellerGetAllInfo");
const sellerGetToCommand = require("./sellerGetToCommand");
const sellerInvoiceGet = require("./sellerInvoiceGet");
const sellerInvoiceGetOne = require("./sellerInvoiceGetOne");
const sellerDeleteInvoice = require("./sellerDeleteInvoice");
const sellerPayRest = require("./sellerPayRest");

module.exports = {
    getAllInfo: sellerGetAllInfo,
    buy: sellerBuy,
    getOneInvoice: sellerInvoiceGetOne,
    getInvoices: sellerInvoiceGet,
    payRest: sellerPayRest,
    getToCommand: sellerGetToCommand,
    addCommand: sellerAddCommand,
    deleteInvoice: sellerDeleteInvoice,
}