const fs = require('fs');
const mongo = require('./db');
const ServerConfig = require("./ServerConfig");
const numeral = require('numeral');

function generateFileName(dest, extname) {
    let name
    while ((name = `${Math.random().toString(36).substr(2, 10)}${extname}`) &&
        fs.existsSync(`${dest}/${name}`)) { };
    return name
}

function secureAndConvertStringToRegex(str, flags) {
    if (!flags) flags = [];
    return typeof str === 'string' && new RegExp(str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), ...flags);
}

const readableUniqueValues = {
    username: "Nom d'utilisateur",
    ice: "ICE"
};

function extractUniqueValues(error) {
    return error && Object.keys(error.keyPattern).map(x => {
        return `${(readableUniqueValues[x] || x)} est deja utilise`
    }).join('\n');
}

function htmlDateToTime(text, start = true) {
    let hours, minutes, seconds;
    let date;
    if (!text) {
        date = new Date();
    } else {
        date = new Date(text);
    }

    if (start) {
        hours = 0 - (date.getTimezoneOffset() / 60);
        minutes = 0;
        seconds = 0;
    } else {
        hours = 23 - (date.getTimezoneOffset() / 60);
        minutes = 59;
        seconds = 59;
    }

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    return date.getTime();
}

function clearUserSessions({ _id, type, logoutOthers, sessionId }) {
    return new Promise(resolve => {
        let sessionKey = ServerConfig.maps.fromTypeToSessionKey[type];
        if (sessionKey) {
            let sessionObject = {}
            let toUnset = {}
            if (logoutOthers && sessionId) {
                sessionObject[`_id`] = {
                    $ne: sessionId, //disconnect from all sessions but this one
                }
            }
            sessionObject[`session.${sessionKey}`] = _id;
            toUnset[`session.${sessionKey}`] = 1;
            mongo.sessions.updateMany(sessionObject, {
                $unset: toUnset
            }, (err, deleteInfo) => {
                resolve(true);
            })
        } else {
            resolve(false);
        }
    })
}

const fixFloat = (number) => {
    let value = parseFloat(numeral(number).format('0.[00]'));
    if(isNaN(value)) {
        value = number;
    }
    return value;
}

const fixInt = (number) => {
    let value = parseInt(numeral(number));
    if(isNaN(value)) {
        value = number;
    }
    return value;
}

module.exports = {
    generateFileName,
    secureAndConvertStringToRegex,
    extractUniqueValues,
    htmlDateToTime,
    clearUserSessions,
    fixFloat,
    fixInt
};