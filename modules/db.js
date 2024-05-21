const mongojs = require('mongojs');
const { MONGO_URL } = require('./ServerConfig');

const db = mongojs(MONGO_URL);

function mongoID(_id) {
    try {
        let mongoId = mongojs.ObjectId(_id);
        return mongoId;
    } catch (error) {
        return "";
    }
}

const cats = db.collection('cats')
const arts = db.collection('arts')
const invoice = db.collection('invoice');
const cmd = db.collection('cmd');

const sellers = db.collection('sellers');
//create the index on username
sellers.createIndex({
    username: 1
}, {
    unique: true
})

const clients = db.collection('clients');
//create the index on ice
clients.createIndex({
    ice: 1
}, {
    unique: true
})

const admin = db.collection('admin');
admin.createIndex({
    username: 1
}, {
    unique: true
});

/*admin.insertOne({
    name: "default",
    username: DEFAULT_CREDS.admin.username,
    password: DEFAULT_CREDS.admin.password,
    time: Date.now()
})*/

const superadmin = db.collection('superadmin');
superadmin.createIndex({
    username: 1
}, {
    unique: true
});

/*superadmin.insertOne({
    name: "SUPER",
    username: DEFAULT_CREDS.superadmin.username,
    password: DEFAULT_CREDS.superadmin.password,
    time: Date.now(),
})*/

const magasin = db.collection('magasin');
magasin.createIndex({
    username: 1
}, {
    unique: true
});

/*magasin.insertOne({
    name: "MAGASIN",
    username: DEFAULT_CREDS.magasin.username,
    password: DEFAULT_CREDS.magasin.password,
    time: Date.now(),
})*/

const sessions = db.collection('sessions');

const payments = db.collection('payments');

const stockHistory = db.collection('stockHistory');

//update payment algorithm in older database

invoice.find({
    payDetails: {
        $exists: false,
    }
}, (err, results) => {
    if(err){
        console.log(err);
        return false;
    }
    for(let result of results){
        invoice.updateOne({
            _id: result._id,
        }, {
            $set: {
                payDetails: [
                    {
                        "amount": result.paid,
                        "profit": result.profitPercent * result.paid,
                        "time": result.time,
                    }
                ]
            }
        }, (err, updateInfo) => {
            console.log(err || updateInfo);
        });
    }
});



const mongo = {
    db,
    mongoID,
    sessions,
    sellers,
    admin,
    superadmin,
    magasin,
    cats,
    arts,
    clients,
    invoice,
    cmd,
    payments,
    stockHistory,
}

module.exports = mongo;