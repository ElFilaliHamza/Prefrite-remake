const mongo = require("../../db");
const ServerUtils = require("../../ServerUtils");

const sellerClientAdd = (req, res) => {
    const sellerId = req.session.sellerId;
    const { ice, name, plafon, coords } = req.body;
    if (!ice || !name || plafon === undefined) {
        res.send({
            error: true,
        });
        return false;
    }
    let loc;
    if (Array.isArray(coords)) {
        coords.reverse();
        loc = {
            type: 'Point',
            coordinates: coords
        };
    } else {
        loc = {
            type: 'Point',
            coordinates: [1, 1]
        }
    }
    const time = Date.now();
    mongo.clients.insertOne({
        sellerId,
        ice,
        name,
        plafon,
        loc,
        time,
    }, (err, insertInfo) => {
        if (err) {
            res.send({
                error: true,
                errorMessage: ServerUtils.extractUniqueValues(err),
            });
            return false;
        }
        res.send({
            ok: true,
            ...insertInfo,
        });
    });
}

module.exports = sellerClientAdd;