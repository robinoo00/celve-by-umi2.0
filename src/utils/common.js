import {Toast,Modal} from 'antd-mobile'

export async function alert(content,duration = 1,onClose,mask = false){
    Toast.info(content,duration,null,mask)
}

export async function modal(content,callback){
    Modal.alert('',content,[
        {text:'我知道了',onPress:callback}
    ])
}

//获取时间
export function getFormatTime(stampTime = (new Date()).getTime(),string = 'yyyy-MM-dd'){
    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,         //月份
            "d+": this.getDate(),          //日
            "h+": this.getHours(),          //小时
            "m+": this.getMinutes(),         //分
            "s+": this.getSeconds(),         //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds()       //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1)
                    ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
    return new Date(stampTime).Format(string);
}

/*是否为交易时段*/
export function isTradeTime(config){
    const holidays = config.holidays
    const limitTime = config.strRisk.tradingTimeLimit.value
    const bool = CompareDate(limitTime.slice(0, 5), limitTime.slice(6, 11), limitTime.slice(12, 17), limitTime.slice(18), holidays)
    return bool
}
export function CompareDate(t1, t2, t3, t4, Vacation) {
    var date = new Date();

    var val = Vacation.split(',')
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var Weekend = date.getDay();
    var nowDate = year + '-' + month + '-' + day

    var h = date.getHours()
    var m = date.getMinutes()
    var a = t1.split(":");
    var b = t2.split(":");
    var c = t3.split(":");
    var d = t4.split(":");
    if (Weekend == 6 || Weekend == 0) {
        return false
    } else if (val.indexOf(nowDate, 0) != -1) {
        return false
    } else if ((date.setHours(h, m) > date.setHours(a[0], a[1]) && date.setHours(h, m) < date.setHours(b[0], b[1])) || (date.setHours(h, m) > date.setHours(c[0], c[1]) && date.setHours(h, m) < date.setHours(d[0], d[1]))) {
        return true
    } else {
        return false
    }
}
/*获取高度*/
export function getHeight(exclude = []) {
    let hei = document.body.offsetHeight
    for(let id of exclude){
        hei -= document.getElementById(id).clientHeight
    }
    return hei
}
