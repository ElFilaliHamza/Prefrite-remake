const mongo = require("../db");

module.exports = function vendeurGet(req, res) {
    mongo.sellers.find({}, {
        name: 1,
        username: 1,
    }).sort({ time: -1 }, (err, data) => {
        res.send(data || []);
    })
}