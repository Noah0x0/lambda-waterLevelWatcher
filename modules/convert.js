'use strict';
const moment = require('moment');

module.exports = {
    toFormattedJson:  (data , locale = null) => {
        // TODO localeで切り替えられるようにする

        // 石川河川水位APIに合わせて、値を変換する
        // constants
        const riverNum = '4_10'; // asano river
        const observatoryNum = '4357_4_84276000_51'; // okihashi observatory

        const timeLine = data[observatoryNum]['timeLineData'];
        const latestData = timeLine[timeLine.length - 1];
        const masterData = data[observatoryNum]['masterData'];
        const customData = data[observatoryNum]['customData'];

        const town = masterData['townName'];
        const point = masterData['pointNameShort'];

        // creating timestamp
        const dateSplit = masterData['etim'].split('-');
        dateSplit[1] = `${parseInt(dateSplit[1], 10) - 1}`; // momentでは0~11で月を表すため
        const timestamp = new moment(dateSplit);

        // TODO レスポンスの雛形オブジェクトの作成
        return {
            riverName: masterData['riverName'].trim(),
            height:  customData['stageAlarmLv7'],
            timestamp: timestamp.utc().format(),
            waterLevel:  latestData[riverNum]['dataStr'],
            dataTrend:  latestData[riverNum]['dataTrend'],
            dataLevel: latestData[riverNum]['dataLevel'],
            observatory:  town + point
        };
    },
};
