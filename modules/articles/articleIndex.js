const artAdd = require("./artAdd");
const artGetOne = require("./artGetOne");
const artDelete = require("./artDelete");
const artUpdate = require("./artUpdate");
const { artGetReq } = require("./artGet");
const artGetHistory = require("./artGetHistory");

module.exports = {
    add: artAdd,
    get: artGetReq,
    getOne: artGetOne,
    delete: artDelete,
    artUpdate: artUpdate,
    getHistory: artGetHistory,
}