const mongo = require("../db");
const ServerConfig = require("../ServerConfig");
const limitAlerts = ServerConfig.limit.alerts;

function count(req, res) {
  mongo.arts.count(
    {
      $where: "this.qtAlerte >= this.qtStocke",
    },
    (err, count) => {
      if (err) {
        res.send({
          error: true,
        });
        return false;
      }
      res.send({
        count,
      });
    }
  );
}

function get(req, res) {
  let { skip } = req.body;
  if (!skip) {
    skip = 0;
  }
  const pipline = [];

  pipline.push({
    $match: {
      $expr: {
        $gte: ["$qtAlerte", "$qtStocke"],
      },
    },
  });

  pipline.push({
    $facet: {
      count: [{ $count: "count" }],
      alerts: [
        {
          $sort: { lastModified: -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: limitAlerts,
        },
        {
          $project: {
            name: 1,
            qtStocke: 1,
            qtAlerte: 1,
            prixVente: 1,
            prixAchat: 1,
          },
        },
      ],
    },
  });

  mongo.arts.aggregate(pipline, (err, info) => {
    if (err) {
      res.send(null);
      return false;
    }

    info = info[0]; //get returned object
    let endAlerts;
    let count = (info.count && info.count[0] && info.count[0].count) || 0;
    if (count <= skip + limitAlerts) {
      //set endAlerts to true if reached limit
      endAlerts = true;
    }

    let alerts = info.alerts;
    res.send({
      endAlerts,
      alerts,
    });
  });
}

const adminAlerts = {
  count,
  get,
};

module.exports = adminAlerts;
