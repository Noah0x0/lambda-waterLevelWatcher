'use strict';

const promise = require('bluebird');
const request = require('request-promise');
const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const convert = require('./modules/convert');

module.exports.handler = (event, context, callback) => {
    return promise.coroutine(processEvent)(event, context, callback);
};

function *processEvent(event, context, callback) {
    console.log('lambda is started');

    const options = {
        uri: 'http://kasen.pref.ishikawa.jp/sp/data/timelineJson/4_10.json',
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response
    };

    const data = yield request(options).catch((err) => {
        console.error(err.stack);
        callback('end fail');
        return;
    });

    const waterLevel = convert.toFormattedJson(data);
    console.log(waterLevel);

    putWaterLevel(waterLevel)
        .then((res) => {
            console.log(res);
            callback(null, 'success');
            return;
        })
        .catch((err) => {
            console.error(err.stack);
            callback(err);
            return;
        });
}

function putWaterLevel(body) {
    console.log(body.timestamp);
    const day = body.timestamp.split('T')[0];
    const daySplit = day.split('-');
    const dictory = `waterLevel/japan/ishikawa/asano/${daySplit[0]}/${daySplit[1]}/${daySplit[2]}/`;

    const time = body.timestamp.substring(11, 19);
    const fileName = `${time}.json`;
    console.log(`${dictory}${fileName}`);

    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: `${dictory}${fileName}`,
        Body: JSON.stringify(body),
        ContentType: 'application/json'
    };

    return s3.putObject(params).promise();
}
