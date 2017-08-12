'use strict';

module.exports = {
    toCommonJson:  (data , locale = null) => {
        // TODO localeで切り替えられるようにする

        // 石川河川水位APIに合わせて、値を変換する
        const asano = '4_10';
        const timeLine = data['4357_4_84276000_51']['timeLineData'];
        const town = data['4357_4_84276000_51']['masterData']['townName'];
        const point = data['4357_4_84276000_51']['masterData']['pointNameShort'];

        // TODO レスポンスの雛形オブジェクトの作成
        return {
            riverName: data['4357_4_84276000_51']['masterData']['riverName'].trim(),
            height:  data['4357_4_84276000_51']['customData']['stageAlarmLv7'],
            timestamp:  data['4357_4_84276000_51']['customData']['stageObsTime'],
            waterLevel:  timeLine[timeLine.length - 1][asano]['dataStr'],
            dataTrend:  timeLine[timeLine.length - 1][asano]['dataTrend'],
            dataLevel: timeLine[timeLine.length - 1][asano]['dataLevel'],
            observatory:  town + point
        };
    },
};
