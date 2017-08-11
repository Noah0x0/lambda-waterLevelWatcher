'use strict';

const promise = require('bluebird');
const request = require('request-promise');
const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

module.exports.handler = (event, context, callback) => {
    return promise.coroutine(processEvent)(event, context, callback);
}

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
    // to quit finally
    // TODO: データの保存をわかりやすくするために浅野川（諸江）に絞っています
    // データ構造が決まったら、絞り込みは解除してループで全川のデータを入れてください
    console.log(data['4357_4_84276000_51']);
    const waterLevel = data['4357_4_84276000_51'];

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
    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: 'waterLevel.json',
        Body: JSON.stringify(body),
        ContentType: 'application/json'
    };
    return s3.putObject(params).promise();
}
