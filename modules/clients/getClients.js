const ServerUtils = require("../ServerUtils");
const ServerConfig = require("../ServerConfig");
const limitClients = ServerConfig.limit.clients;

const mongo = require("../db");

module.exports = function getClients(req, res) {
    let { skip, search, sellerId, getAll } = req.body;
    if (!skip) {
        skip = 0;
    }

    const pipline = [];

    let toMatch = {}

    if(sellerId){
        toMatch['sellerId'] = sellerId
    }
    if (search) {
        toMatch['$or'] = [
            {
                ice: search
            }, {
                name: ServerUtils.secureAndConvertStringToRegex(search, "i"),
            }
        ]
    }

    if (Object.keys(toMatch).length) {
        pipline.push({
            $match: toMatch
        });
    }
    let facet = {}
    facet.count = [{ $count: "count" }];

    facet.clients = [];
    facet.clients.push({
        $sort: {
            time: -1
        }
    });
    if(skip){
        facet.clients.push({
            $skip: skip
        });
    }
    if(!getAll){
        facet.clients.push({
            $limit: limitClients
        })
    }
    pipline.push({
        $facet: facet
    });

    mongo.clients.aggregate(pipline, (err, info) => {
        if (err) {
            res.send(null)
            return false
        }

        info = info[0]; //get returned object
        let endClients;
        let count = (info.count && info.count[0] && info.count[0].count) || 0;
        if (count <= ((skip || 0) + limitClients)) { //set endClients to true if reached limit
            endClients = true;
        }

        let clients = info.clients;
        res.send({
            endClients,
            clients,
            sellerId
        })
    })
}