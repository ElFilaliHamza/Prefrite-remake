const mongo = require("../db");
const ServerConfig = require("../ServerConfig");
const artProject = ServerConfig.project.articles;

const limitArticle = ServerConfig.limit.articles;

function artGet({ catId, skip, getAll }) {
    return new Promise((resolve, reject) => {
        const pipline = [];
        if (catId) {
            pipline.push({
                $match: {
                    catId: catId
                }
            })
        };

        let facet = {};
        facet.count = [{ $count: "count" }];
        facet.arts = [];

        facet.arts.push({
            $addFields: {
                //time: -1,
                lowerName: { "$toLower": "$name" }
            }
        })
        facet.arts.push({
            $sort: {
                //time: -1,
                lowerName: 1
            }
        })
        if (skip) {
            facet.arts.push({
                $skip: skip
            })
        }
        if (!getAll) {
            facet.arts.push({
                $limit: limitArticle
            })
        }
        facet.arts.push({
            $project: {
                ...artProject
            }
        })

        pipline.push({
            $facet: facet
        });

        mongo.arts.aggregate(pipline, (err, info) => {
            if (err) {
                res.send(null)
                return false
            }

            info = info[0]; //get returned object
            let endArticles;
            let count = (info.count && info.count[0] && info.count[0].count) || 0;
            if (count <= ((skip || 0) + limitArticle)) { //set endArticles to true if reached limit
                endArticles = true;
            }

            let data = info.arts;
            resolve({
                ok: true,
                endArticles,
                data
            })
        })
    })
}

function artGetReq(req, res) {
    let { catId, skip, getAll } = req.body
    artGet({ catId, skip, getAll }).then(info => {
        res.send(info)
    }).catch(error => {
        res.send(error);
    })
}

module.exports = {
    artGet,
    artGetReq
}