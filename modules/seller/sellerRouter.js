const { payDebit } = require('../clients/clientsIndex');
const commandIndex = require('../commands/commandIndex');
const mongo = require('../db');
const ServerConfig = require('../ServerConfig');
const sellerClientAdd = require('./sellerClientUtils/sellerClientAdd');
const sellerIndex = require('./sellerIndex');

const sellerRouter = require('express').Router();
const articleProject = ServerConfig.project.articles;

sellerRouter.post('/session', (req, res) => {
    let sellerId = req.session.sellerId
    if (sellerId) {
        /* try {
            mongo.sellers.findOne({
                _id: mongo.mongoID(sellerId)
            }, (err, info) => {
                if(info) {
                    return res.send({
                        logged: true
                    });
                }
                res.send({});
            })
        } catch (error) {
            
        } */
        return res.send({
            logged: true
        });
    } else {
        res.send({});
    }
});

sellerRouter.post('/session/logout', (req, res) => {
    req.session.sellerId = null;
    req.session.superSeller = null;
    res.send({});
});

//give access

sellerRouter.use((req, res, next) => {
    let sellerId = req.session.sellerId;
    if (!sellerId) {
        res.send({ access: false });
        return false;
    }
    //give access to super admin to sell
    let superSeller = req.session.superSeller;
    if (superSeller) {
        req.superSeller = true;
    }
    next();
});

sellerRouter.post('/getAllInfo', sellerIndex.getAllInfo);
sellerRouter.post('/buy', sellerIndex.buy);
sellerRouter.post('/invoice/get', sellerIndex.getInvoices);
sellerRouter.post('/invoice/getOne', sellerIndex.getOneInvoice);
sellerRouter.post('/invoice/delete', sellerIndex.deleteInvoice);
sellerRouter.post('/payRest', sellerIndex.payRest);
sellerRouter.post('/getToCommand', sellerIndex.getToCommand);
sellerRouter.post('/addCommand', sellerIndex.addCommand);
sellerRouter.post('/cmd/get', async (req, res) => {
    let { filter = {}, skip } = req.body;
    const toSend = await commandIndex.getCommands({
        skip,
        getAll: true,
        specificSeller: req.session.sellerId,
        filter,
    });
    res.send(toSend);
});
sellerRouter.post('/cmd/getOne', (req, res) => {
    let { _id } = req.body;
    const { sellerId } = req.session;
    try {
        mongo.cmd.findOne({
            _id: mongo.mongoID(_id),
            sellerId: sellerId, //verify access
        }, async (err, cmd) => {
            if (err || !cmd) {
                return res.send({
                    error: true
                });
            }
            if (Array.isArray(cmd.articles)) {
                try {
                    const articles = [];
                    for (let article of cmd.articles) {
                        let articleInfo = await new Promise(resolve => {
                            mongo.arts.findOne({
                                _id: mongo.mongoID(article._id)
                            }, articleProject, (err, articleInfo) => {
                                if (err || !articleInfo) {
                                    return resolve(null);
                                }
                                articleInfo.qt = article.qt;
                                resolve(articleInfo);
                            })
                        })
                        if (articleInfo) {
                            articles.push(articleInfo);
                        }
                    }
                    cmd.articles = articles;
                    return res.send({
                        ok: true,
                        cmd
                    });
                } catch {

                }
            }
        })
    } catch (error) {

    }
});

sellerRouter.post("/clients/add", sellerClientAdd);
sellerRouter.post("/clients/payDebit", payDebit);

module.exports = sellerRouter;
