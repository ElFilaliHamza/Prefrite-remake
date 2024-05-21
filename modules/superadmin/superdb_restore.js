const AdmZip = require('adm-zip');
const mongo = require("../db")
const fs = require('fs')

async function superdb_restore() {
    let filepath = __dirname + '/' + "backup.zip";
    if (fs.existsSync(filepath)) {
        var zip = new AdmZip(filepath);
        var zipEntries = zip.getEntries(); // an array of ZipEntry records

        for (let zipEntry of zipEntries) {
            let colName = zipEntry.entryName.split('.')[0];
            await new Promise(async resolve => {
                let data = JSON.parse(zipEntry.getData().toString());
                if(colName === 'sessions'){
                    data = data.map(entry => {
                        if(entry.expires){
                            entry.expires = new Date(entry.expires)
                        }
                        if(entry.session && entry.session.cookie){
                            entry.session.cookie.expires = new Date(entry.session.cookie.expires)
                        }
                        return entry
                    })
                } else {
                    data = data.map(entry => {
                        entry._id = mongo.mongoID(entry._id)
                        return entry
                    })
                }
                await new Promise(resolve => {
                    mongo.db.collection(colName).insertMany(data, () => {
                        resolve();
                    });
                })
                resolve();
            });
            console.log(colName + " backed")
        }
    }
    process.exit(0);
}
superdb_restore()