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

    const waterLevel = convertLocalData(data);
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
    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: 'waterLevel.json',
        Body: JSON.stringify(body),
        ContentType: 'application/json'
    };
    return s3.putObject(params).promise();
}

// 石川河川水位APIに合わせて、値を変換する
function convertLocalData(data , locale) {
    // TODO: localeで切り替えられるようにする
    // データの保存をわかりやすくするために浅野川（諸江）に絞っています
    const asano = '4_10';
    const timeLine = data['4357_4_84276000_51']['timeLineData'];
    const town = data['4357_4_84276000_51']['masterData']['townName'];
    const point = data['4357_4_84276000_51']['masterData']['pointNameShort'];

    // TOOD レスポンスの雛形オブジェクトの作成
    const waterLevel = {
        riverName: data['4357_4_84276000_51']['masterData']['riverName'],
        height:  data['4357_4_84276000_51']['customData']['stageAlarmLv7'],
        timestamp:  data['4357_4_84276000_51']['customData']['stageObsTime'],
        waterLevel:  timeLine[timeLine.length - 1][asano]['dataStr'],
        dataTrend:  timeLine[timeLine.length - 1][asano]['dataTrend'],
        dataLevel: timeLine[timeLine.length - 1][asano]['dataLevel'],
        observatory:  town + point
    };

    return waterLevel;
}
