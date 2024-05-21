const commandIndex = require('../commands/commandIndex');
const adminIndex = require('./adminIndex');
const { NO_ACCESS, NOT_LOGGED, LOGGED } = require('../ServerConfig');
const clientsIndex = require('../clients/clientsIndex');
const vendeurIndex = require('../vendeurs/vendeurIndex');
const debitIndex = require('../debit/debitIndex');
const statsIndex = require('../stats/statsIndex');

const adminRouter = require('express').Router()

adminRouter.post('/login', adminIndex.userLogin);

adminRouter.post('/session', (req, res) => {
    if (req.session.admin) {
        res.send(LOGGED);
    } else {
        res.send(NOT_LOGGED);
    }
});

adminRouter.post('/session/logout', (req, res) => {
    req.session.admin = null;
    res.send(NOT_LOGGED);
});

/* //let multer upload before checking for access!
adminRouter.post('/articles/add', articleIndex.add);

adminRouter.post('/articles/update', articleIndex.artUpdate); */

//give access
adminRouter.use((req, res, next) => {
    let admin = req.session.admin;
    if (!admin) {
        res.send(NO_ACCESS);
        return false;
    } else {
        next();
    }
});

/* ;[
    'add',
    'update',
    'delete',
    'get',
    'getOne',
].forEach(route => {
    adminRouter.post('/categories/' + route, categorieIndex[route]);
});

/* ;[
    'get',
    'getOne',
    'delete',
].forEach(route => {
    adminRouter.post('/articles/' + route, articleIndex[route]);
}); */

;[
    'getToPay',
    'getHistory',
].forEach(route => {
    adminRouter.post('/stats/' + route, statsIndex[route]);
});

;[
    /* 'add',
    'update', */
    'get',
    'getOne',
    'getCategories',
    'getArticles',
    'addArticle',
    'removeArticle',
    'updateArticle',
    'getStats',
    'getClients',
    'handPayment',
    'getInvoice',
].forEach(route => {
    adminRouter.post('/vendeurs/' + route, vendeurIndex[route]);
});

;[
    'add',
    'update',
    'deleteClient',
    'get',
    'getOne',
].forEach(route => {
    adminRouter.post('/clients/' + route, clientsIndex[route]);
});

/* ;[
    'count',
    'get',
].forEach(route => {
    adminRouter.post('/alerts/' + route, adminIndex.adminAlerts[route]);
}); */

;[
    'count',
    'get',
    'getOne',
    /*'confirmCmd',
    'cancelCmd',*/
].forEach(route => {
    adminRouter.post('/cmd/' + route, commandIndex[route]);
});

;[
    'count',
    'getSellers',
    'getClients',
].forEach(route => {
    adminRouter.post('/debit/' + route, debitIndex[route]);
});

module.exports = adminRouter;