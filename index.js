'use strict';

const Promise = require('bluebird');
const request = require('request-promise');

module.exports.handler = (event, context, callback) => {
    return Promise.coroutine(processEvent)(event, context, callback);
}

function *processEvent(event, context, callback) {
    console.log('lambda is started');

    var options = {
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
    callback(null, "success");
};
