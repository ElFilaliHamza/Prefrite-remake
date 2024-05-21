const mongo = require("../db");

module.exports = function addAdmin(req, res) {
  let { name, username, password } = req.body;
  mongo.admin.insertOne(
    {
      name,
      username,
      password,
      time: Date.now(),
    },
    (err, insertInfo) => {
      if (err || insertInfo.nInserted === 0) {
        res.send({
          error: true,
        });
        return false;
      }
      res.send({
        ok: true,
        insertInfo,
      });
    }
  );
};
