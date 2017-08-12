'use strict';
const moment = require('moment');

module.exports = {
    toCommonJson:  (data , locale = null) => {
        // TODO localeで切り替えられるようにする

        // 石川河川水位APIに合わせて、値を変換する
        // constants
        const ISO8601 = "YYYY-MM-DD HH:mm:ss";
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
        const timeStr = dateSplit[0] + '-' +dateSplit[1] + '-' + dateSplit[2] + " " + dateSplit[3] + ":" + dateSplit[4];
        const timestamp = new moment(timeStr);

        // TODO レスポンスの雛形オブジェクトの作成
        return {
            riverName: masterData['riverName'].trim(),
            height:  customData['stageAlarmLv7'],
            timestamp:  timestamp.format(ISO8601),
            waterLevel:  latestData[riverNum]['dataStr'],
            dataTrend:  latestData[riverNum]['dataTrend'],
            dataLevel: latestData[riverNum]['dataLevel'],
            observatory:  town + point
        };
    },
};
