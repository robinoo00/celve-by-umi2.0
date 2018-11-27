import Base from './base'
import {getDPR} from '@/utils/common'

const work = window.work;

class Init extends Base {
    constructor() {
        super();
    }

    reload(){
        var self = this;
        self.分时数据 = [];
        self.昨收 = null;
        self.市价 = null;
        self.最后一柱 = null;
        self.k线柱宽度 = 6;
        self.k线柱间隔 = 3;
        self.开始条数 = 0;
        self.结束条数 = 0;
        self.第一次加载数据 = false;
        self.数据长度 = 0;
    }

    loading() {
        var self = this;
        self.画布上下文.clearRect(0, 0, self.画布宽度, self.画布高度);
        self.画布上下文.font = "19px sans-serif";
        self.画布上下文.fillStyle = '#aaa';
        self.画布上下文.fillText("数据加载中..", (self.画布宽度 / 2) - 50, (self.画布高度 / 2) - 10);
        self.画布上下文.save();
    }

    getdata(data) {
        var self = this;
        if (self.第一次加载数据 == false) {
            if (data.length == 0) {
                self.画布上下文.clearRect(0, 0, self.画布宽度, self.画布高度);
                //self.画布上下文.font = "19px sans-serif";
                //self.画布上下文.fillStyle = '#aaa';
                //self.画布上下文.fillText("未开盘", (self.画布宽度 / 2) - 50, (self.画布高度 / 2) - 10);
                //self.画布上下文.save();
                return;
            }
            ;
            for (var i = 0; i < data.length; i++) {
                self.分时数据.push({
                    市价: data[i]["现价"],
                    时间: data[i]["结束时间"],
                    开盘: Number(data[i]["开仓"]),
                    收盘: Number(data[i]["收盘"]),
                    最高: Number(data[i]["最高"]),
                    最低: Number(data[i]["最低"]),
                    量: Number(data[i]["量"]),
                    存收: Number(data[i]["收盘"])
                });
            }
            ;
            self.分时数据[0]["量"] = 0;
            self.分时数据[self.分时数据.length - 1]["收盘"] = self.分时数据[self.分时数据.length - 1]["现价"];
            self.昨收 = Number(data[0]["昨收"]);
            var zh = data[data.length - 1];
            self.市价 = zh.现价;
            self.最后一柱 = zh;
            var a = (self.K线区宽度 - self.左边距 - self.左线边距 - self.右边距) / self.K线显示柱条数;
            self.k线柱宽度 = a * 0.7;
            self.k线柱间隔 = a - self.k线柱宽度;
            self.开始条数 = (self.分时数据.length - self.K线显示柱条数) < 0 ? 0 : self.分时数据.length - self.K线显示柱条数;
            self.结束条数 = (self.开始条数 + self.K线显示柱条数) > self.分时数据.length ? self.分时数据.length : (self.开始条数 + self.K线显示柱条数);
            self.kuanjia();
            self.第一次加载数据 = true;
            self.数据长度 = self.分时数据.length;
            // window.setTimeout(function () {
            //     if(self.最后一柱){
            //         work.server.k线(self.代码, self.类型, self.最后一柱.结束时间);
            //     }
            // }, 500);
        } else {
            if (data.length == 0) {
                return;
            };
            if (data.length == 1) {
                self.分时数据[self.分时数据.length - 1]["收盘"] = data[0]["现价"] == 0 ? self.分时数据[self.分时数据.length - 1]["收盘"] : data[0]["现价"];
            } else if (data.length > 1) {
                var 差 = data.length - 1;
                data.forEach((item,i) => {
                    if(data[i+1]){
                        if(item['结束时间'] === data[i+1]['结束时间']){
                            差 -=1
                        }
                    }
                })
                self.开始条数 += 差;
                self.结束条数 += 差;
                self.分时数据[self.分时数据.length - 1]["收盘"] = self.分时数据[self.分时数据.length - 1]["存收"];
                for (var i = 0; i < data.length; i++) {
                    if (i > 0) {
                        if(self.分时数据[self.分时数据.length - 1]['时间'] != data[i]['结束时间']){
                            self.分时数据.push({
                                市价: data[i]["现价"],
                                时间: data[i]["结束时间"],
                                开盘: Number(data[i]["开仓"]),
                                收盘: Number(data[i]["收盘"]),
                                最高: Number(data[i]["最高"]),
                                最低: Number(data[i]["最低"]),
                                量: Number(data[i]["量"]),
                                存收: Number(data[i]["收盘"])
                            });
                        }
                    }
                }
            }
            var zh = data[data.length - 1];
            self.市价 = zh.现价;
            self.最后一柱 = zh;
            if (self.十字线显示 == false && self.放大 == false) {
                self.kuanjia();
            }
            ;
            self.第一次加载数据 = true;
            self.数据长度 = self.分时数据.length;
            // window.setTimeout(function () {
            //     if(self.最后一柱){
            //         work.server.k线(self.代码, self.类型, self.最后一柱.结束时间);
            //     }
            // }, 500)
        }
    }
    kuanjia() {
        var self = this;
        if (self.分时数据.length <= 0) {
            return;
        }
        self.画布上下文.clearRect(0, 0, self.画布宽度, self.画布高度);
        self.画布上下文.font = "15px sans-serif";
        self.画布上下文.globalAlpha = 1;
        if (self.分时数据.length > 0) {
            var 收盘价 = [];
            self.新数组 = [];
            self.M5 = [];
            self.M10 = [];
            self.M15 = [];
            self.MACD = [];
            self.均线 = [];
            self.新MACD = [];
            for (var i = 0; i < self.分时数据.length; i++) {
                if (i == 0) {
                    var macdiem = {
                        EMA12: 0,
                        EMA26: 0,
                        DIFF: 0,
                        DEA: 0,
                        BAR: 0,
                        收盘价: self.分时数据[i].收盘
                    };
                    self.MACD.push(macdiem);
                } else {
                    var EMA12 = self.MACD[i - 1].EMA12 * 11 / 13 + self.分时数据[i].收盘 * 2 / 13;
                    var EMA26 = self.MACD[i - 1].EMA12 * 25 / 27 + self.分时数据[i].收盘 * 2 / 27;
                    var DIFF = EMA12 - EMA26;
                    var DEA = self.MACD[i - 1].DEA * 8 / 10 + DIFF * 2 / 10;
                    var macdiem = {
                        EMA12: EMA12,
                        EMA26: EMA26,
                        DIFF: DIFF,
                        DEA: DEA,
                        BAR: 2 * (DIFF - DEA),
                        收盘价: self.分时数据[i].收盘
                    };
                    self.MACD.push(macdiem);
                }
            }
            var kd;
            for (var i = self.开始条数; i < self.结束条数; i++) {
                self.新数组.push(self.分时数据[i]);
                if (self.结束条数 <= self.分时数据.length) {
                    收盘价.push(Number(self.分时数据[i].收盘));
                } else {
                    收盘价.push(0);
                }
                self.新MACD.push(self.MACD[i]);
            }
            self.计算数据 = self.getlendata(self.新数组);
            // console.log('新数组',self.新数组)
            kd = (self.K线区宽度 - self.左边距 - self.左线边距 - self.右边距) / self.K线显示柱条数;
            self.高度价格比列 = (self.K线区高度 - self.底边距 - self.上边距) / Math.abs(self.计算数据.最大值 - self.计算数据.最小值);

            var c1 = "", c2 = "";
            c1 = self.分时刻度文字颜色;
            c2 = self.分时刻度文字颜色;
            //绘制分时刻度线
            self.画布上下文.strokeStyle = self.分时刻度颜色;
            self.画布上下文.beginPath();
            self.画布上下文.moveTo(self.左边距 + self.左线边距, self.上边距);
            self.画布上下文.lineTo(self.K线区宽度 - self.右边距, self.上边距);
            self.画布上下文.stroke();
            self.画布上下文.save();
            self.画布上下文.fillStyle = c1;
            self.画布上下文.fillText(self.计算数据.最大值.toFixed(2), self.左边距, self.上边距 + 15);
            self.画布上下文.save();

            self.画布上下文.strokeStyle = self.分时刻度颜色;
            self.画布上下文.moveTo(self.左边距 + self.左线边距, self.K线区高度 - self.底边距);
            self.画布上下文.lineTo(self.K线区宽度 - self.右边距, self.K线区高度 - self.底边距);
            self.画布上下文.stroke();
            self.画布上下文.save();
            self.画布上下文.fillStyle = c1;
            self.画布上下文.fillText(self.计算数据.最小值.toFixed(2), self.左边距, (self.K线区高度 - self.底边距));
            self.画布上下文.save();

            self.画布上下文.font = "15px sans-serif";
            self.量高度价格比列 = (self.量区高度 - self.量区间隔) / Math.abs(self.计算数据.量最大值 - self.计算数据.量最小值);
            var 平均高度 = (self.K线区高度 - self.上边距 - self.底边距) / 8;
            var j = 0;
            for (var i = 0; i < 8; i++) {
                self.画布上下文.fillStyle = self.分时刻度文字颜色;
                if (i > 0 && i < 8) {
                    var y坐标 = parseInt(平均高度.toFixed(0)) * i + 0.5 + self.上边距;
                    self.画布上下文.fillText((self.计算数据.最大值 - 平均高度 / self.高度价格比列 * i).toFixed(2), self.左边距, y坐标 - 8);
                    self.画布上下文.save();
                    self.画布上下文.strokeStyle = self.分时刻度颜色;
                    self.画布上下文.beginPath();
                    self.画布上下文.moveTo(self.左边距 + self.左线边距, y坐标);
                    self.画布上下文.lineTo(self.K线区宽度 - self.右边距, y坐标);
                    self.画布上下文.stroke();
                    self.画布上下文.save();
                }
            }
            //绘制底部柱图
            for (var i = 0; i < self.新数组.length; i++) {
                var itm = self.新数组[i];
                var c = Math.floor(self.新数组.length / 6);
                self.画布上下文.fillStyle = self.分时刻度文字颜色;
                self.画布上下文.strokeStyle = self.分时刻度颜色;
                //绘制时间
                if (i > 0 && i % 20 == 0) {
                    var x = (i * (self.k线柱宽度 + self.k线柱间隔) + self.左边距 + self.左线边距) - 40;
                    var xxx = i * (self.k线柱宽度 + self.k线柱间隔) + self.左边距 + self.左线边距;
                    self.画布上下文.fillText(self.time4(itm.时间), x, self.K线区高度);
                    self.画布上下文.save();
                    self.画布上下文.beginPath();
                    self.画布上下文.moveTo(xxx, self.上边距);
                    self.画布上下文.lineTo(xxx, self.K线区高度 - self.底边距);
                    self.画布上下文.stroke();
                    self.画布上下文.save();
                }

                if (i == self.新数组.length - 1) {
                    var x = (i * (self.k线柱宽度 + self.k线柱间隔) + self.左边距 + self.左线边距) - 40;
                    self.画布上下文.fillText(self.time4(itm.时间), x, self.K线区高度);

                }
                var k线柱颜色 = itm.开盘 > itm.收盘 ? self.K柱阴颜色 : (itm.开盘 == itm.收盘 ? self.K柱阴颜色 : self.K柱阳颜色);
                self.画布上下文.fillStyle = k线柱颜色;
                //K线柱图
                if (self.类型 != "分时") {
                    var k线柱颜色 = itm.开盘 > itm.收盘 ? self.K柱阴颜色 : (itm.开盘 == itm.收盘 ? self.K柱阴颜色 : self.K柱阳颜色);
                    var k线柱高度 = 0.5;
                    var bb = Math.abs(itm.开盘 - itm.收盘) * self.高度价格比列;
                    if (bb > 0) {
                        k线柱高度 = bb;
                    }
                    ;
                    var k线柱X = i * (self.k线柱宽度 + self.k线柱间隔) + self.左边距 + self.左线边距;
                    var k线柱Y = ((self.计算数据.最大值 - (Math.max(itm.开盘, itm.收盘))) * self.高度价格比列) + self.上边距;
                    if (k线柱X + self.k线柱宽度 <= self.K线区宽度 - self.右边距) {
                        self.画布上下文.beginPath();
                        self.画布上下文.fillStyle = k线柱颜色;
                        self.画布上下文.fillRect(k线柱X, k线柱Y, self.k线柱宽度, k线柱高度);
                        self.画布上下文.stroke();
                        self.画布上下文.save();

                        var k线中心线高度 = Math.abs(itm.最高 - itm.最低) * self.高度价格比列;
                        var k线中心线X = k线柱X + Math.floor(self.k线柱宽度 / 2) + 0.5;
                        var k线中心线Y = (self.计算数据.最大值 - itm.最高) * self.高度价格比列 + self.上边距;
                        self.画布上下文.beginPath();
                        self.画布上下文.strokeStyle = k线柱颜色;
                        self.画布上下文.moveTo(k线中心线X, k线中心线Y);
                        self.画布上下文.lineTo(k线中心线X, k线中心线Y + k线中心线高度);
                        self.画布上下文.stroke();
                        self.画布上下文.save();
                    }
                }

                var 颜色 = itm.开盘 > itm.收盘 ? self.K柱阴颜色 : (itm.开盘 == itm.收盘 ? self.K柱阴颜色 : self.K柱阳颜色);
                self.画布上下文.strokeStyle = "#ff0000";
                var 量柱高度 = self.新数组[i].量 * self.量高度价格比列;
                var 量柱X = i * (self.k线柱宽度 + self.k线柱间隔) + self.左边距 + self.左线边距;
                var 量柱Y = self.K线区高度 + self.MACD区高度 + self.量区间隔 + (self.计算数据.量最大值 - self.新数组[i].量) * self.量高度价格比列;

                self.画布上下文.beginPath();
                self.画布上下文.fillRect(量柱X, 量柱Y, self.k线柱宽度 - 1, 量柱高度);
                self.画布上下文.stroke();
                self.画布上下文.save();

                self.M5.push(self.qingjingzhi(收盘价, i, 5));
                self.M10.push(self.qingjingzhi(收盘价, i, 10));
                self.M15.push(self.qingjingzhi(收盘价, i, 15));

            }
        }
        ;

        // 分时 K线
        if (self.类型 == "分时") {
            for (var i = 0; i < 收盘价.length; i++) {
                self.均线.push(Number(self.junjia(收盘价, i + 1)));
            }
            //分时橙线
            self.画布上下文.strokeStyle = '#ff5400';
            for (var i = 0; i < self.均线.length; i++) {
                if (i > 0) {
                    var 均线起x = kd * (i - 1) + self.左边距 + self.左线边距;
                    var 均线起y = (self.计算数据.最大值 - self.均线[i - 1]) * self.高度价格比列 + self.上边距;
                    var 均线始x = kd * i + self.左边距 + self.左线边距;
                    var 均线始y = (self.计算数据.最大值 - self.均线[i]) * self.高度价格比列 + self.上边距;
                    self.画布上下文.beginPath();
                    self.画布上下文.moveTo(均线起x, 均线起y);
                    self.画布上下文.lineTo(均线始x, 均线始y);
                    self.画布上下文.stroke();
                    self.画布上下文.save();
                }
            }
            ;
            //分时白线
            for (var i = 0; i < self.新数组.length; i++) {
                self.画布上下文.strokeStyle = "#ffffff";
                if (i < self.新数组.length && i > 0) {
                    var 起x = kd * (i - 1) + self.左边距 + self.左线边距;
                    var 起y = (self.计算数据.最大值 - self.新数组[i - 1].收盘) * self.高度价格比列 + self.上边距;
                    var 始x = kd * i + self.左边距 + self.左线边距;
                    var 始y = (self.计算数据.最大值 - self.新数组[i].收盘) * self.高度价格比列 + self.上边距;
                    self.画布上下文.beginPath();
                    self.画布上下文.moveTo(起x, 起y);
                    self.画布上下文.lineTo(始x, 始y);
                    self.画布上下文.stroke();
                    self.画布上下文.save();
                }
            }

        }
        // 非分时 K线
        if (self.类型 != "分时") {
            self.画布上下文.strokeStyle = self.M5颜色;
            for (var i = 0; i < self.M5.length; i++) {
                if (i > 0) {
                    var M5起x = kd * (i - 1) + self.左边距 + self.左线边距;
                    var M5起y = ((self.计算数据.最大值 - self.M5[i - 1]) * self.高度价格比列) + self.上边距;
                    var M5始x = kd * i + self.左边距 + self.左线边距;
                    var M5始y = ((self.计算数据.最大值 - self.M5[i]) * self.高度价格比列) + self.上边距;
                    self.画布上下文.beginPath();
                    self.画布上下文.moveTo(M5起x, M5起y);
                    self.画布上下文.lineTo(M5始x, M5始y);
                    self.画布上下文.stroke();
                    self.画布上下文.save();
                }
            }
            ;
            self.画布上下文.strokeStyle = self.M10颜色;
            for (var i = 0; i < self.M10.length; i++) {
                if (i > 0) {
                    var M5起x = kd * (i - 1) + self.左边距 + self.左线边距;
                    var M5起y = ((self.计算数据.最大值 - self.M10[i - 1]) * self.高度价格比列) + self.上边距;
                    var M5始x = kd * i + self.左边距 + self.左线边距;
                    var M5始y = ((self.计算数据.最大值 - self.M10[i]) * self.高度价格比列) + self.上边距;
                    self.画布上下文.beginPath();
                    self.画布上下文.moveTo(M5起x, M5起y);
                    self.画布上下文.lineTo(M5始x, M5始y);
                    self.画布上下文.stroke();
                    self.画布上下文.save();
                }
            }
            ;
            self.画布上下文.strokeStyle = self.M15颜色;
            for (var i = 0; i < self.M15.length; i++) {
                if (i > 0) {
                    var M5起x = kd * (i - 1) + self.左边距 + self.左线边距;
                    var M5起y = ((self.计算数据.最大值 - self.M15[i - 1]) * self.高度价格比列) + self.上边距;
                    var M5始x = kd * i + self.左边距 + self.左线边距;
                    var M5始y = ((self.计算数据.最大值 - self.M15[i]) * self.高度价格比列) + self.上边距;
                    self.画布上下文.beginPath();
                    self.画布上下文.moveTo(M5起x, M5起y);
                    self.画布上下文.lineTo(M5始x, M5始y);
                    self.画布上下文.stroke();
                    self.画布上下文.save();
                }
            }
        }


        self.macd计算 = self.MACDlen(self.新MACD);


        var ab = self.macd计算.最小值 < 0 ? Math.abs(self.macd计算.最小值) + self.macd计算.最大值 : self.macd计算.最大值 - self.macd计算.最小值
        self.MACD高度价格比列 = self.MACD区高度 / Math.abs(ab);
        self.BAR高度价格比列 = self.MACD区高度 / 2 / self.macd计算.BAR最大值;
        //底部上部分柱图
        for (var i = 0; i < self.新MACD.length; i++) {
            var itm = self.新MACD[i];
            if (i > 0) {
                self.画布上下文.strokeStyle = "#ffffff";
                var DIFF起x = kd * (i - 1);
                var DIFF起y = self.K线区高度 + (self.macd计算.最大值 - self.新MACD[i - 1].DIFF) * self.MACD高度价格比列;
                var DIFF始x = kd * i;
                var DIFF始y = self.K线区高度 + (self.macd计算.最大值 - self.新MACD[i].DIFF) * self.MACD高度价格比列;
                self.画布上下文.beginPath();
                self.画布上下文.moveTo(DIFF起x, DIFF起y);
                self.画布上下文.lineTo(DIFF始x, DIFF始y);
                self.画布上下文.stroke();
                self.画布上下文.save();

                self.画布上下文.lineWidth = 1;
                self.画布上下文.strokeStyle = "#ffd800";
                var DEA起x = kd * (i - 1);
                var DEA起y = self.K线区高度 + (self.macd计算.最大值 - self.新MACD[i - 1].DEA) * self.MACD高度价格比列;
                var DEA始x = kd * i;
                var DEA始y = self.K线区高度 + (self.macd计算.最大值 - self.新MACD[i].DEA) * self.MACD高度价格比列;
                self.画布上下文.beginPath();
                self.画布上下文.moveTo(DEA起x, DEA起y);
                self.画布上下文.lineTo(DEA始x, DEA始y);
                self.画布上下文.stroke();
                self.画布上下文.save();
            }
            var BAR颜色 = itm.BAR >= 0 ? self.K柱阳颜色 : self.K柱阴颜色;
            var k线柱X = (i * (self.k线柱宽度 + self.k线柱间隔) + self.左边距 + self.左线边距);
            var k线柱Y;
            if (itm.BAR > 0) {
                k线柱Y = self.K线区高度 + (self.macd计算.BAR最大值 - itm.BAR) * self.BAR高度价格比列;
                var 高 = Math.abs(itm.BAR) * self.BAR高度价格比列;
                self.画布上下文.fillStyle = BAR颜色;
                self.画布上下文.beginPath();
                self.画布上下文.fillRect(k线柱X, k线柱Y, self.k线柱宽度, 高);
                self.画布上下文.stroke();
                self.画布上下文.save();
            } else {

                var 高 = Math.abs(itm.BAR) * self.BAR高度价格比列;
                self.画布上下文.fillStyle = BAR颜色;
                self.画布上下文.beginPath();
                self.画布上下文.fillRect(k线柱X, self.K线区高度 + self.MACD区高度 / 2, self.k线柱宽度, 高);
                self.画布上下文.stroke();
                self.画布上下文.save();
            }
        }


        // self.画布上下文.fillStyle = '#fff';
        // self.画布上下文.font = "50px sans-serif";
        // self.画布上下文.fillText(self.市价, self.左边距 + self.左线边距 + 80, 50);


        ///////////////////////////////////////////////////////////////////////////////

    }
    eve() {
        var self = this;
        var klineHammer = new window.Hammer.Manager(document.getElementById("k"));
        var pan = new window.Hammer.Pan();
        var pinch = new window.Hammer.Pinch();
        var press = new window.Hammer.Press();
        klineHammer.add([pan, pinch, press]);

        klineHammer.on("panstart", function (e) {
            self.拖动开始x = e.changedPointers[0].pageX * 2;
        });

        klineHammer.on("panright", function (e) {
            self.拖动结束x = e.changedPointers[0].pageX * 2;
            if (self.十字线显示) {
                var y = e.changedPointers[0].pageY;
                self.shizhi(e.changedPointers[0].pageX * 2, y * 2);
            } else {
                var 拖动距离 = Math.abs(self.拖动结束x - self.拖动开始x);
                var 拖动条数 = Math.floor((拖动距离 / (self.k线柱宽度 + self.k线柱间隔)) * 0.5);
                self.开始条数 = (self.开始条数 - 拖动条数) < 0 ? 0 : (self.开始条数 - 拖动条数);
                self.结束条数 = (self.结束条数 - 拖动条数) < self.K线显示柱条数 ? self.结束条数 : (self.结束条数 - 拖动条数);
                self.jishuan();
            }
        });
        klineHammer.on("panleft", function (e) {
            self.拖动结束x = e.changedPointers[0].pageX * 2;
            if (self.十字线显示) {
                var y = e.changedPointers[0].pageY;
                self.shizhi(e.changedPointers[0].pageX * 2, y * 2);
            } else {
                var 拖动距离 = Math.abs(self.拖动结束x - self.拖动开始x);
                var 拖动条数 = Math.floor((拖动距离 / (self.k线柱宽度 + self.k线柱间隔)) * 0.5);
                self.开始条数 = (self.开始条数 + 拖动条数) > self.分时数据.length - self.K线显示柱条数 ? self.分时数据.length - self.K线显示柱条数 : (self.开始条数 + 拖动条数);
                self.结束条数 = (self.结束条数 + 拖动条数) > self.分时数据.length ? self.分时数据.length : (self.结束条数 + 拖动条数);
                self.jishuan();
            }

        });
        klineHammer.on("panup", function (e) {
            self.十字线显示 = true;
            var y = e.changedPointers[0].pageY;
            self.shizhi(e.changedPointers[0].pageX * 2, y * 2);
        });

        klineHammer.on("pandown", function (e) {
            self.十字线显示 = true;
            var y = e.changedPointers[0].pageY;
            self.shizhi(e.changedPointers[0].pageX * 2, y * 2);
        });
        klineHammer.on("press", function (e) {
            self.十字线显示 = true;
            var y = e.changedPointers[0].pageY;
            self.shizhi(e.changedPointers[0].pageX * 2, y * 2);
        });
        klineHammer.on("pressup", function () {
            self.十字线显示 = false;
            self.kuanjia();
        });

        klineHammer.on("panend", function () {
            self.十字线显示 = false;
            self.kuanjia();
        });
        klineHammer.on("pinchstart", function (e) {
            self.放大 = true;
        });
        klineHammer.on("pinchend", function (e) {
            self.放大 = false;
        });
        klineHammer.on("pinchin", function (e) {
            self.K线显示柱条数 = self.K线显示柱条数 + Math.floor(2 / e.scale);
            if (self.K线显示柱条数 > self.分时数据.length) {
                self.K线显示柱条数 = self.分时数据.length;
            }
            ;
            self.jishuan();
        });

        klineHammer.on("pinchout", function (e) {
            self.K线显示柱条数 = self.K线显示柱条数 - Math.floor(1.9 * e.scale);
            if (self.K线显示柱条数 < 1) {
                self.K线显示柱条数 = 1;
            }
            ;
            self.jishuan();
        });
    }    jishuan() {
        var self = this;
        var a = (self.K线区宽度 - self.左边距 - self.左线边距 - self.右边距) / self.K线显示柱条数;
        self.k线柱宽度 = a * 0.7;
        self.k线柱间隔 = a - self.k线柱宽度;
        self.开始条数 = (self.结束条数 - self.K线显示柱条数) < 0 ? 0 : self.结束条数 - self.K线显示柱条数;
        self.结束条数 = (self.开始条数 + self.K线显示柱条数) > self.分时数据.length ? self.分时数据.length : (self.开始条数 + self.K线显示柱条数);
        self.kuanjia();
    }
    //十字线
    shizhi(x, y) {
        x = x/ 2
        y = y/ 2
        var self = this;
        y = y - self.距顶距离;
        self.kuanjia();
        var xx, yy;
        xx = x;
        yy = y;
        if (y < self.上边距) {
            yy = self.上边距;
        };
        if (y > self.K线区高度 - self.底边距) {
            yy = self.K线区高度 - self.底边距;
        };
        if (x < self.左边距 + self.左线边距) {
            xx = self.左边距 + self.左线边距
        };
        if (x > self.K线区宽度 - self.右边距) {
            xx = self.K线区宽度 - self.右边距
        };
        var dpr = getDPR()
        var coef = dpr / 2
        self.画布上下文.font = "15px sans-serif";
        self.画布上下文.save();
        self.画布上下文.beginPath();
        self.画布上下文.strokeStyle = self.十字线颜色;
        self.画布上下文.moveTo(self.左边距 + self.左线边距, yy/coef);
        self.画布上下文.lineTo(self.K线区宽度 - self.右边距, yy/coef);
        self.画布上下文.moveTo(xx/coef, self.上边距);
        self.画布上下文.lineTo(xx/coef, self.画布高度);
        self.画布上下文.stroke();
        self.画布上下文.restore();

        self.画布上下文.fillStyle = self.显示文本颜色;
        var z = (self.计算数据.最大值 - ((y - self.上边距) / self.高度价格比列)).toFixed(2);
        self.画布上下文.fillText(z, self.左边距 + self.左线边距 + 10, yy);
        self.画布上下文.save();


        //绘制左边显示数据
        self.画布上下文.beginPath();
        self.画布上下文.fillStyle = "#000000";
        self.画布上下文.globalAlpha = 0.7;
        self.画布上下文.fillRect(0, 0, 200, 440);
        self.画布上下文.stroke();
        self.画布上下文.save();

        var kd = (self.K线区宽度 - self.左边距 - self.左线边距 - self.右边距) / self.新数组.length;
        kd = kd * coef
        var 数据索引 = Math.floor((x - self.左边距 - self.左线边距) / kd);
        数据索引 = 数据索引 < 0 ? 0 : 数据索引;
        self.画布上下文.fillStyle = self.显示文本颜色;
        self.画布上下文.fillText("开:" + self.新数组.length <= 0 || 数据索引 >= self.新数组.length ? "-" : "开:" + self.新数组[数据索引].开盘,10,  30);
        self.画布上下文.fillText("高:" + self.新数组.length <= 0 || 数据索引 >= self.新数组.length ? "-" : "高:" + self.新数组[数据索引].最高, 10, 60);
        self.画布上下文.fillText("低:" + self.新数组.length <= 0 || 数据索引 >= self.新数组.length ? "-" : "低:" + self.新数组[数据索引].最低, 10,90);
        self.画布上下文.fillText("收:" + self.新数组.length <= 0 || 数据索引 >= self.新数组.length ? "-" : "收:" + self.新数组[数据索引].最低,10,120);
        self.画布上下文.fillText("量:" + self.新数组.length <= 0 || 数据索引 >= self.新数组.length ? "-" : "量:" + self.新数组[数据索引].量, 10, 150);
        self.画布上下文.fillStyle = self.M5颜色;
        self.画布上下文.fillText("M5:" + self.M5.length <= 0 || 数据索引 >= self.M5.length ? "-" : "M5:" + Number(self.M5[数据索引]).toFixed(2), 10, 180);
        self.画布上下文.fillStyle = self.M10颜色;
        self.画布上下文.fillText("M10:" + self.M10.length <= 0 || 数据索引 >= self.M10.length ? "-" : "M10:" + Number(self.M10[数据索引]).toFixed(2), 10, 210);
        self.画布上下文.fillStyle = self.M15颜色;
        self.画布上下文.fillText("M15:" + self.M15.length <= 0 || 数据索引 >= self.M15.length ? "-" : "M15:" + Number(self.M15[数据索引]).toFixed(2), 10, 240);
        self.画布上下文.fillStyle = self.DIFF颜色;
        self.画布上下文.fillText("DIFF:" + self.新MACD.length <= 0 || 数据索引 >= self.新MACD.length ? "-" : "DIFF:" + Number(self.新MACD[数据索引].DIFF).toFixed(2), 10, 270);
        self.画布上下文.fillStyle = self.DEA颜色;
        self.画布上下文.fillText("DEA:" + self.新MACD.length <= 0 || 数据索引 >= self.新MACD.length ? "-" : "DEA:" + Number(self.新MACD[数据索引].DEA).toFixed(2), 10, 300);
        self.画布上下文.fillStyle = self.BAR颜色;
        self.画布上下文.fillText("BAR:" + self.新MACD.length <= 0 || 数据索引 >= self.新MACD.length ? "-" : "BAR:" + Number(self.新MACD[数据索引].BAR).toFixed(2), 10, 330);
        self.画布上下文.fillStyle = self.显示文本颜色;
        self.画布上下文.fillText("时:" + self.新数组.length <= 0 || 数据索引 >= self.新数组.length ? "-" : "时:" + self.time4(self.新数组[数据索引].时间), 10, 360);
        self.画布上下文.save();
    }
}

export default Init
