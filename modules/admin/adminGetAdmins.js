const mongo = require("../db");
const ServerConfig = require("../ServerConfig");
const adminProject = ServerConfig.project.admin;

function adminGetAdmins(req, res) {
  let adminId = req.session.admin;
  mongo.admin.find({}, adminProject).sort({ time: -1 }, (err, data) => {
    if (err || !data) {
      res.send(null);
      return false;
    }
    let admins = data.map((admin) => {
      if (admin._id == adminId) {
        admin.me = true;
      }
      return admin;
    });
    res.send({
      admins,
    });
  });
}

module.exports = adminGetAdmins;
