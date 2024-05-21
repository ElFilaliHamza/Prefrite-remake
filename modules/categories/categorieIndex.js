const catAdd = require('./catAdd');
const catGet = require('./catGet');
const catGetOne = require('./catGetOne');
const catDelete = require('./catDelete');
const catUpdate = require('./catUpdate');

module.exports = {
    add: catAdd,
    update: catUpdate,
    get: catGet,
    getOne: catGetOne,
    delete: catDelete
}
