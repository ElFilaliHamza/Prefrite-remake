const commandIndex = require('../commands/commandIndex');
const mongo = require('../db');
const { NO_ACCESS, NOT_LOGGED, LOGGED } = require('../ServerConfig');

const magasinRouter = require('express').Router()

magasinRouter.post('/login', (req, res) => {
    let { username, password } = req.body;
    mongo.magasin.findOne({
        username: username
    }, (err, info) => {
        if (err || !info) {
            res.send({
                error: true
            });
            return false;
        }

        if (password === info.password) {
            req.session.magasin = info._id.toString();
            res.send({
                logged: true
            });
        } else {
            res.send({
                error: true
            })
        }
    })
});

magasinRouter.post('/session', (req, res) => {
    if (req.session.magasin) {
        res.send(LOGGED);
    } else {
        res.send(NOT_LOGGED);
    }
});

magasinRouter.post('/session/logout', (req, res) => {
    req.session.magasin = null;
    res.send(NOT_LOGGED);
});

//give access
magasinRouter.use((req, res, next) => {
    let magasin = req.session.magasin;
    if (!magasin) {
        res.send(NO_ACCESS);
        return false;
    } else {
        next();
    }
});

;[
    'count',
    'get',
    'getOne',
    'confirmCmd',
    'cancelCmd',
    'getStatus',
    'removeCmdArt',
].forEach(route => {
    magasinRouter.post('/cmd/' + route, commandIndex[route]);
});

magasinRouter.post('/stock/get', (req, res) => {
    mongo.arts.aggregate([
        {
            $project: {
                name: 1,
                qtStocke: 1,
            }
        }
    ], (err, articles) => {
        res.send({
            ok: true,
            articles: articles
        });
    });
});

module.exports = magasinRouter;