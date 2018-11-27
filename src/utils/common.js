import {Toast,Modal} from 'antd-mobile'
import {port} from '@/defaultSettings'

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

/*获取银行LOGO*/
export function getBankLogo(name){
    let prefix = port + '/dianmai/images/'
    let src = ''
    switch (name){
        case '工商银行' || '中国工商银行':
            src = '20171228101805.jpg'
            break
        case '农业银行' || '中国农业银行':
            src = '20171228101943.jpg'
            break
        case '中国银行':
            src = '20171228102035.jpg'
            break
        case '建设银行' || '中国建设银行':
            src = '20171228101914.jpg'
            break
        case '光大银行':
            src = '20171228101841.jpg'
            break
        case '华夏银行' || '中国华夏银行':
            src = '20171228101848.jpg'
            break
        case '北京银行':
            src = '20171228101826.jpg'
            break
        case '交通银行' || '中国交通银行':
            src = '20171228101930.jpg'
            break
        case '上海银行':
            src = '20171228102012.jpg'
            break
        case '中国邮政' || '中国邮政储蓄银行':
            src = '20171228102020.jpg'
            break
        case '招商银行' || '中国招商银行':
            src = 'timg.jpg'
            break
        default:
            src = 'icon_big.png'
    }
    return prefix + src
}

//获取当前时间戳
function time(time = '') {
    if(time){
        return Math.floor(new Date(time).getTime() / 1000);
    }else{
        return Math.floor(new Date().getTime() / 1000);
    }
}
function rebuildTime(time) {
    if(time.includes('-')){
        time = time.replace(/\-/g, "/");
    }
    return time
}
/*友好时间显示方法  参数：例子2018-1-1*/
export function mdate($time) {
    var time_stamp = time(rebuildTime($time))
    var now_d = new Date();
    var now_time = now_d.getTime() / 1000; //获取当前时间的秒数
    var f_d = new Date();
    f_d.setTime(time_stamp * 1000);
    var f_time = f_d.toLocaleDateString();

    var ct = now_time - time_stamp;
    var day = 0;
    if (ct < 0)
    {
        f_time = "【预约】" + f_d.toLocaleString();
    }
    else if (ct < 60)
    {
        f_time = Math.floor(ct) + '秒前';
    }
    else if (ct < 3600)
    {
        f_time = Math.floor(ct / 60) + '分钟前';
    }
    else if (ct < 86400)//一天
    {
        f_time = Math.floor(ct / 3600) + '小时前';
    }
    else if (ct < 604800)//7天
    {
        day = Math.floor(ct / 86400);
        if (day < 2)
            f_time = '昨天';
        else
            f_time = day + '天前';
    }
    else
    {
        day = Math.floor(ct / 86400);
        f_time = day + '天前';
    }
    return f_time;
}

/*添加股票代码前缀0 SZ 6 SH*/
export function reBuildCode(code){
    const firstNum = Number([...code][0])
    if(firstNum === 0){
        code = 'SZ' + code
    }
    if(firstNum === 1){
        code = 'SH' + code
    }
    return code
}

export function getDPR(){
    const dpr = document.getElementsByTagName('html')[0].getAttribute("data-dpr");
    return dpr
}
/*base64 转图片*/
export function dataURLtoFile(dataurl, filename){//将base64转换为文件
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
    // var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    //     bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    // while(n--){
    //     u8arr[n] = bstr.charCodeAt(n);
    // }
    // return new File([u8arr], filename, {type:mime});
}
