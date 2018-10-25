import Common from './common'
import {getFormatTime} from '@/utils/common'

export default class {
    constructor(params) {
        const id = params.id
        const height = params.height
        const window_width = window.screen.width
        this.id = id
        this.类型 = '分时'
        this.data = []
        this.新数组 = []
        this.画布 = document.getElementById(id)
        this.画布上下文 = this.画布.getContext("2d")
        this.画布.width = window_width * 2
        this.画布.height = height
        this.K线区高度 = this.画布.height * 0.6
        this.量区高度 = (this.画布.height - this.K线区高度) * 0.4
        this.MACD区高度 = (this.画布.height - this.K线区高度) * 0.6
        this.计算数据 = []
        this.K线显示柱条数 = 100
        this.k线柱间隔 = 3
        this.k线柱宽度 = (window_width - this.k线柱间隔 * (this.K线显示柱条数 - 1)) / this.K线显示柱条数
        this.分时刻度个数 = 9
        this.时间个数 = 5
        this.收盘价 = []
        this.M5 = []
        this.M10 = []
        this.M15 = []
        this.底边距 = 0
        this.上边距 = 0
        this.K柱阴颜色 = "#35f2f8"
        this.K柱阳颜色 = "#b71d39"
        this.k线柱宽度 = 6
        this.MACD = []
        this.M5颜色 = "#b2ff94"
        this.M10颜色 = "#94e2ff"
        this.M15颜色 = "#ffe594"
        this.DIFF颜色 = "#ff3455"
        this.DEA颜色 = "#ffd800"
        this.BAR颜色 = "#00ccc9"
    }

    /*获取新数组*/
    getDrawArr() {
        const re = this.data.slice(this.开始条数, this.结束条数)
        if (re.length != 100) {
            console.log('出错开始条数', this.开始条数)
            console.log('出错结束条数', this.结束条数)
            console.log('出错K线显示柱条数', this.K线显示柱条数)
            console.log('出错data', this.data)
            console.log('出错新数组', re)
        }
        return re
    }

    /*
    * 初始化数据
    * */
    initData() {
        const data = this.新数组
        let arr1 = [];//计算数据
        let arr2 = [];//计算数据
        this.收盘价 = []
        data.forEach((item, i) => {
            arr1 = [
                ...arr1,
                item.开仓,
                item.收盘,
                item.最高,
                item.最低,
            ]
            arr2.push(item.量)
            this.收盘价.push(item.收盘)
        })
        this.新MACD = this.MACD.slice(this.开始条数, this.结束条数)
        this.计算数据 = {
            最大值: Math.max(...arr1),
            最小值: Math.min(...arr1),
            量最大值: Math.max(...arr2),
            量最小值: Math.min(...arr2)
        }
    }

    initMACDData() {
        this.MACD = []
        this.data.forEach((item, i) => {
            //赋值MACD
            let macdiem = {}
            if (i === 0) {
                macdiem = {
                    EMA12: 0,
                    EMA26: 0,
                    DIFF: 0,
                    DEA: 0,
                    BAR: 0,
                    收盘价: item.收盘
                }
            } else {
                let EMA12 = this.MACD[i - 1].EMA12 * 11 / 13 + item.收盘 * 2 / 13;
                let EMA26 = this.MACD[i - 1].EMA12 * 25 / 27 + item.收盘 * 2 / 27;
                let DIFF = EMA12 - EMA26;
                let DEA = this.MACD[i - 1].DEA * 8 / 10 + DIFF * 2 / 10;
                macdiem = {
                    EMA12: EMA12,
                    EMA26: EMA26,
                    DIFF: DIFF,
                    DEA: DEA,
                    BAR: 2 * (DIFF - DEA),
                    收盘价: item.收盘
                };
            }
            this.MACD.push(macdiem);
        })
    }

    /*获取macd计算数据*/
    MACDlen() {
        let MACD最大值 = 0, MACD最小值 = 1000000, BAR最大值 = 0, BAR最小值 = 1000000;
        this.新MACD.forEach(itm => {
            if (itm.DIFF > MACD最大值) MACD最大值 = itm.DIFF;
            if (itm.DIFF < MACD最小值) MACD最小值 = itm.DIFF;

            if (itm.DEA > MACD最大值) MACD最大值 = itm.DEA;
            if (itm.DEA < MACD最小值) MACD最小值 = itm.DEA;

            if (Math.abs(itm.BAR) > BAR最大值) BAR最大值 = Math.abs(itm.BAR);
            if (itm.BAR < BAR最小值) BAR最小值 = itm.BAR;
        })
        return {
            最大值: MACD最大值,
            最小值: MACD最小值,
            BAR最大值: BAR最大值,
            BAR最小值: BAR最小值
        };
    }

    //获取分时刻度线数据
    getLeftData() {
        const max = this.计算数据.最大值
        const min = this.计算数据.最小值
        const diff = (max - min) / (this.分时刻度个数 - 1)
        let res = []
        for (let i = 0; i < this.分时刻度个数; i++) {
            res.push((min + i * diff).toFixed(2))
        }
        return res
    }

    //通过数组获取K线区域 线条坐标数组
    getKCoord(arr) {
        const diff = this.getCrowwDiff()
        let draw_arr = []
        arr.forEach((v, i) => {
            draw_arr.push({
                x: diff * i,
                y: this.getYCoordByValue(v)
            })
        })
        return draw_arr
    }

    /*
    * 通过数组获取MAC区域 线条坐标数组
    * */
    getMACCoord(arr) {
        const diff = this.getCrowwDiff()
        let draw_arr = []
        arr.forEach((v, i) => {
            draw_arr.push({
                x: diff * i,
                y: this.getMACCoordByValue(v)
            })
        })
        return draw_arr
    }

    /*获取横向绘制单位长度*/
    getCrowwDiff() {
        return this.画布.width / (this.K线显示柱条数 - 1)
    }

    /*通过数值计算K线区Y坐标*/
    getYCoordByValue(v) {
        const max = this.计算数据.最大值
        const min = this.计算数据.最小值
        const area_height = this.K线区高度
        return ((v - max) / (min - max)) * area_height
    }

    /*通过数值计算MAC区线条Y坐标*/
    getMACCoordByValue(v) {
        const max = this.macd计算.最大值
        const min = this.macd计算.最小值
        const area_height = this.MACD区高度
        return ((v - max) / (min - max)) * area_height + this.K线区高度
    }

    /*通过数值计算MAC区域BAR柱图Y坐标*/
    getMACCoordByBarValue(v) {
        const max = this.macd计算.BAR最大值
        const min = this.macd计算.BAR最小值
        const area_height = this.MACD区高度
        return ((v - max) / (min - max)) * area_height + this.K线区高度
    }

    /*通过数值计算量区柱图Y坐标*/
    getLiangCoordByValue(v) {
        const max = this.计算数据.量最大值
        const min = this.计算数据.量最小值
        const area_height = this.量区高度
        return ((v - max) / (min - max)) * area_height + this.K线区高度 + this.MACD区高度
    }

    /*通过差值计算K线区域柱图高度*/
    getKHeightByDiff(v1, v2) {
        const height = Math.abs(v1 - v2) / (this.计算数据.最大值 - this.计算数据.最小值) * this.K线区高度
        return height
    }

    /*通过量值计算量区域柱图高度*/
    getLiangBarHeight(v) {
        const height = Math.abs(v) / (this.计算数据.量最大值 - this.计算数据.量最小值) * this.量区高度
        return height
    }

    //获取均线数据
    getJunArr() {
        let 收盘价 = this.收盘价
        let 均价 = []
        for (let i = 1; i <= 收盘价.length; i++) {
            let arr = 收盘价.slice(0, i)
            if (arr.length != 0) {
                均价.push(Common.getAveByArr(arr))
            }
        }
        return 均价
    }

    //获取时间数据
    getTimeArr() {
        const data = this.新数组
        const diff = data.length / this.时间个数
        const result = []
        for (let i = 0; i <= this.时间个数; i++) {
            let index = i * diff === data.length ? data.length - 1 : i * diff
            const time = this.handleTimeFormat(data[index]['结束时间'])
            result.push(time)
        }
        return result
    }
    handleTimeFormat(time){
        let timeStamp = Date.parse(new Date(time))
        time = getFormatTime(timeStamp, 'MM/dd hh:mm')
        return time
    }

    //获取时间坐标
    getTimeCoord(arr) {
        const num = this.时间个数
        const result = []
        const width = this.画布.width
        const diff = width / num
        arr.reverse()
        for (let i = 0; i < num; i++) {
            result.push({
                x: width - i * diff,
                y: this.K线区高度,
                v: arr[i]
            })
        }
        return result
    }

    assignMData() {
        const data = this.新数组
        this.M5 = []
        this.M10 = []
        this.M15 = []
        data.forEach((v, i) => {
            this.M5.push(Common.qingjingzhi(this.收盘价, i, 5));
            this.M10.push(Common.qingjingzhi(this.收盘价, i, 10));
            this.M15.push(Common.qingjingzhi(this.收盘价, i, 15));
        })

    }
}
