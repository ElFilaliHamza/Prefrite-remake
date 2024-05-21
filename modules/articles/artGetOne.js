const mongo = require("../db");
const ServerConfig = require("../ServerConfig");
const artProject = ServerConfig.project.articles;

module.exports = function artGetOne(req, res) {
    let { _id } = req.body;
    try{
        mongo.arts.findOne({
            _id: mongo.mongoID(_id)
        }, {
            ...artProject
        }, (err, data) => {
            if(err || !data){
                res.send(null)
            } else {
                res.send(data);
            }
        })
    } catch(error){
        res.send(null)
    }
    return false;
}