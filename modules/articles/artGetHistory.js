const mongo = require("../db");
const ServerConfig = require("../ServerConfig");
const artsProject = ServerConfig.project.articles;
const limitStockHistory = ServerConfig.limit.stockHistory;
const artGetHistory = (req, res) => {
    const { _id, skip = 0 } = req.body;
    const pipeline = [];
    const facet = {};
    if(_id){
        pipeline.push({
            $match: {
                artId: _id,
            }
        })
    }

    facet.stockHistory = [];
    facet.count = [
        {
            $count: "count",
        }
    ];
    facet.stockHistory.push({
        $sort: {
            time: -1,
        }
    });

    if(skip){
        facet.stockHistory.push({
            $skip: skip,
        });
    }

    facet.stockHistory.push({
        $limit: limitStockHistory,
    });

    //push $facet to pipeline
    pipeline.push({
        $facet: facet,
    });

    mongo.stockHistory.aggregate(pipeline, async (err, data) => {
        data = data[0];
        const stockHistory = data.stockHistory;

        if(Array.isArray(stockHistory)){
            for(let h of stockHistory){
                const artInfo = await new Promise(resolve => {
                    mongo.arts.findOne({
                        _id: mongo.mongoID(h.artId),
                    }, artsProject, (err, artInfo) => {
                        resolve(artInfo || {});
                    })
                });
                h.artInfo = artInfo;
            }
        }
        const count = (data.count && data.count[0] && data.count[0].count) || 0;
        const endHistory = (skip + limitStockHistory) >= count;
        const toSend = {
            ok: true,
            stockHistory: stockHistory,
            endHistory: endHistory,
        }
        res.send(toSend);
    });
}

module.exports = artGetHistory;