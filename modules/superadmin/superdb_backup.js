const AdmZip = require('adm-zip');
const mongo = require("../db")
const fs = require('fs');

const cols = [
    'clients',
    'sellers',
    'admin',
    'magasin',
    'cats',
    'arts',
    'invoice',
    'cmd',
    'superadmin',
    'sessions',
    'payments',
    'stockHistory',
];

module.exports = async function superdb_backup(req, res){
    var zip = new AdmZip();
    if(!fs.existsSync(__dirname + "/backups")){
        fs.mkdirSync(__dirname + "/backups");
    }
    for(let colName of cols){
        await new Promise(resolve => {
            mongo.db.collection(colName).find({}, (err, info) => {
                let content = JSON.stringify(info);
                fs.writeFileSync(__dirname + "/backups/" + colName + ".json", content);
                zip.addLocalFile(__dirname + "/backups/" + colName + ".json");
                resolve();
            });
        });
    }
    if(fs.existsSync(__dirname + "/backups/backup.zip")){
        fs.unlinkSync(__dirname + "/backups/backup.zip");
    }
    zip.writeZip(__dirname + "/backups/backup.zip")    
    res.sendFile(__dirname + "/backups/backup.zip")
}