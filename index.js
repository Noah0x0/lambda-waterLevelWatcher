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
    });

    const waterLevel = convert.toFormattedJson(data);
    console.log(waterLevel);

    putWaterLevel(waterLevel)
        .then((res) => {
            console.log(res);
            callback(null, 'success');
        })
        .catch((err) => {
            console.err(err.stack);
            callback(err);
        });
}

function putWaterLevel(body) {
    const dt = new Date().getTime();
    const fileName = `sample_json/waterLevel${dt}.json`;

    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: fileName,
        Body: JSON.stringify(body),
        ContentType: 'application/json'
    };

    return s3.putObject(params).promise();
}
