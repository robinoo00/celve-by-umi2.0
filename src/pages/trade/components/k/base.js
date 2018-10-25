class Base {
    constructor() {
        this.宽 = null;
        this.高 = null;
        this.分时url = null;
        this.开 = null;
        this.昨收 = null;
        this.分时数据 = [];
        this.定时器 = null;
        this.画布 = null;
        this.画布上下文 = null;
        this.画布宽度 = null;
        this.画布高度 = null;
        this.K线区宽度 = null;
        this.K线区高度 = null;
        this.量区宽度 = null;
        this.量区高度 = null;
        this.MACD区宽度 = null;
        this.MACD区高度 = null;
        this.MACD区间隔 = 10;
        this.量区间隔 = 0;
        this.画布id = null;
        this.类型 = null;
        this.代码 = null;
        this.第一次加载数据 = false;
        this.定时 = 1000;
        this.左边距 = 0;
        this.左线边距 = 0;
        this.右边距 = 0;
        this.底边距 = 0;
        this.上边距 = 0;//20
        this.开始条数 = 0;
        this.结束条数 = 0;
        this.k线柱宽度 = 6;
        this.k线柱间隔 = 3;
        this.K线显示柱条数 = 100;
        this.高度价格比列 = 0;
        this.量高度价格比列 = 0;
        this.MACD高度价格比列 = 0;
        this.BAR高度价格比列 = 0;
        this.平仓数据 = { 数手: 0 };
        this.量数组 = [];
        this.新量数组 = [];
        this.均线 = [];
        this.新数组 = [];
        this.M5 = [];
        this.M10 = [];
        this.M15 = [];
        this.MACD = [];
        this.新MACD=[];
        this.量计算数据 = {};
        this.计算数据 = {};
        this.macd计算 = {};
        this.拖动开始x = 0;
        this.拖动结束x = 0;
        this.十字线显示 = false;
        this.放大 = false;
        this.数据长度 = 0;
        this.最后一柱 = null;
        this.实时线颜色 = "#ff0000";
        this.K柱阴颜色 = "#35f2f8";
        this.K柱阳颜色 = "#b71d39";
        this.均线颜色 = "#fd4801";
        this.M5颜色 = "#b2ff94";
        this.M10颜色 = "#94e2ff";
        this.M15颜色 = "#ffe594";
        this.量柱颜色 = "#00a50c";
        this.量柱颜色1 = "#e92e10";
        this.时间颜色 = "#ff0000";
        this.价格颜色 = "#ff0000";
        this.买颜色 = "#fd00ca";
        this.卖颜色 = "#0095fd";
        this.最新价颜色 = "#0cff00";
        this.显示文本颜色 = "#ffffff";
        this.分时线颜色 = "#ff0000";
        this.分时刻度颜色 = "#282934";
        this.分时刻度文字颜色 = "#c3c3c3";
        this.十字线颜色 = "#c3c3c3";
        this.DIFF颜色 = "#ff3455";
        this.DEA颜色="#ffd800";
        this.BAR颜色= "#00ccc9";
        this.量区比列 = 0.6;
        this.市价 = null;
        this.距顶距离 = 0;
    }
    init() {
        var self = this;
        self.画布 = document.getElementById(self.画布id);
        self.画布上下文 = self.画布.getContext("2d");
        self.画布.width = self.宽 * 2;
        self.画布.height = self.高 * 2;
        self.画布宽度 = self.宽 * 2;
        self.画布高度 = self.高 * 2;
        self.K线区宽度 = self.画布宽度;
        self.K线区高度 = self.画布高度 * self.量区比列;
        self.量区宽度 = self.画布宽度;
        self.量区高度 = (self.画布高度 - self.K线区高度) * 0.4;
        self.MACD区宽度 = self.画布宽度;
        self.MACD区高度 = (self.画布高度 - self.K线区高度) * 0.6;
        self.画布上下文.translate(0.5, 0.5);
        self.画布上下文.lineWidth = 1;
    }
    getlendata(data){
        var self = this;

        var 输出数组 = {};
        var 最大值 = 0, 最小值 = 1000000, 收盘价最大值 = 0, 收盘价最小值 = 1000000;
        data.forEach(function (itm) {
            if(!itm){
                console.log('新数组',self.新数组)
                console.log('分时数据',self.分时数据)
                console.log('开始条数',self.开始条数)
                console.log('结束条数',self.结束条数)
            }
            if (itm.开盘 > 最大值) 最大值 = itm.开盘;
            if (itm.开盘 < 最小值) 最小值 = itm.开盘;

            if (itm.收盘 > 最大值) 最大值 = itm.收盘;
            if (itm.收盘 < 最小值) 最小值 = itm.收盘;

            if (itm.最高 > 最大值) 最大值 = itm.最高;
            if (itm.最高 < 最小值) 最小值 = itm.最高;

            if (itm.最低 > 最大值) 最大值 = itm.最低;
            if (itm.最低 < 最小值) 最小值 = itm.最低;
        });


        if (self.类型 == "分时") {
            //输出数组.最大值 = 最大值 + ((最大值 - 最小值)/4);
            //输出数组.最小值 = 最小值 - ((最大值 - 最小值) / 4);
            输出数组.最大值 = 最大值;
            输出数组.最小值 = 最小值;
            输出数组.量最大值 = self.getMax(data,'量');
            输出数组.量最小值 = self.getMin(data,'量');
            return 输出数组;
        } else {
            输出数组.最大值 = 最大值;
            输出数组.最小值 = 最小值;
            输出数组.量最大值 = self.getMax(data,'量');
            输出数组.量最小值 = self.getMin(data,'量');
            return 输出数组;
        }

    }    getMax(data,key){
        var max = data[0][key];
        for(var i = 0; i < data.length; i ++){
            if(data[i][key] > max){
                max = data[i][key];
            }
        }
        return max;
    }
    getMin(data,key){
        var min = data[0][key];
        for(var i = 0; i < data.length; i ++){
            if(data[i][key] < min){
                min = data[i][key];
            }
        }
        return min;
    }
    qingjingzhi(sz, index, val) {
        var avg = 0;
        var sum = 0;
        var start = index < val ? 0 : (index - (val - 1));
        var end = index + 1;
        for (var i = start; i < end; i++) {
            sum += sz[i];
        }
        ;
        avg = sum / (index < val ? index + 1 : val);
        return avg.toFixed(4);
    }
    time4(t) {
        t = t.replace(/\-/g, "/");
        var d = new Date(t);
        const year = d.getFullYear();
        const mon = d.getMonth() + 1;
        const day = d.getDate();
        const s = mon + "/" + day + " " + d.getHours() + ":" + d.getMinutes();
        return s;
    }
    MACDlen(data) {
        var MACD最大值 = 0, MACD最小值 = 1000000, BAR最大值 = 0, BAR最小值 = 1000000;
        data.forEach(function (itm) {
            if (itm.DIFF > MACD最大值) MACD最大值 = itm.DIFF;
            if (itm.DIFF < MACD最小值) MACD最小值 = itm.DIFF;

            if (itm.DEA > MACD最大值) MACD最大值 = itm.DEA;
            if (itm.DEA < MACD最小值) MACD最小值 = itm.DEA;

            if (Math.abs(itm.BAR) > BAR最大值) BAR最大值 = Math.abs(itm.BAR);
            if (itm.BAR < BAR最小值) BAR最小值 = itm.BAR;
        })

        var 输出数组 = {};
        输出数组.最大值 = MACD最大值;
        输出数组.最小值 = MACD最小值;
        输出数组.BAR最大值 = BAR最大值;
        输出数组.BAR最小值 = BAR最小值;
        return 输出数组;
    }
    junjia(sz, index) {
        var avg = 0;
        var sum = 0;
        for (var i = 0; i < index; i++) {
            sum += sz[i];
        }
        ;
        avg = sum / index;
        return avg;
    }}

export default Base
