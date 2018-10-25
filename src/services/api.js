import request from '@/utils/request';

export async function GetNews(params) {
    return request(`app/GetNews`,{
        method: 'POST',
        body: {
            ...params,
        }
    });
}

export async function MarketPrice() {
    return request(`app/MarketPrice`,{
        method: 'POST'
    });
}
/*
* 搜索 code(关键词)
* */
export async function Search(params) {
    return request(`dmapi/Search`,{
        method: 'POST',
        body: {
            ...params,
        }
    });
}
// 添加自选 code
export async function SelectedStockAdd({code}) {
    return request(`app/SelectedStockAdd?code=${code}`);
}
/*
* 自选 收藏 列表
* */
export async function SelectedStockList() {
    return request(`app/SelectedStockList`);
}
//删除自选
export async function SelectedStockDel({code}) {
    return request(`app/SelectedStockDel?code=${code}`);
}
//调序
export async function SelectedStockSort({content}) {
    return request(`app/SelectedStockSort?content=${content}`);
}

export async function Login(params) {
    return request(`app/Login`,{
        method: 'POST',
        body: {
            ...params,
        }
    });
}
/*
* 发送短信 phone
* */
export async function SendSmsCode(params) {
    return request(`app/SendSmsCode `,{
        method: 'POST',
        body: {
            ...params,
        }
    });
}
/*
* 发送修改银行卡验证码
* */
export async function SendModifyCardCode() {
    return request(`app/SendModifyCardCode `,{
        method: 'POST'
    });
}
/*
*  修改银行卡
* */
export async function ModifyCard(params) {
    return request(`app/ModifyCard `,{
        method: 'POST',
        body: {
            ...params,
        }
    });
}

export async function Register(params) {
    return request(`app/Reg `,{
        method: 'POST',
        body: {
            ...params,
        }
    });
}

export async function ForgotPass(params) {
    return request(`app/ForgotPass`,{
        method: 'POST',
        body: {
            ...params,
        }
    });
}

export async function Userinfo() {
    return request(`app/userinfo`,{
        method: 'POST',
    });
}

/*
* 实名认证
* */
export async function RealName(params) {
    return request(`app/RealName`,{
        method: 'POST',
        body: params
    });
}
/*
* 获取K线数据
* */
export async function getKData(params){
    return request(`dmapi/KlineDataRmote?contract=${params.contract}&&type=${params.type}&&time=${params.time}`);
    // return request(`http://106.14.7.216:1010/api/api/getk?contract=${params.contract}&&type=${params.type}&&time=${params.time}`);
    // return request(`http://47.100.236.123:6601/dmapi/KlineDataRmote?contract=${params.contract}&&type=${params.type}&&time=${params.time}`);
}
/*
* 获取盘口数据
* */
export async function GetShares(params) {
    return request(`dmapi/GetShares`,{
        method: 'POST',
        body: params
    });
}
/*交易基本参数*/
export async function TradeConfig(params) {
    return request(`dmapi/baseconfiginfo`,{
        method: 'POST',
        body: params
    });
}
/*创建订单*/
export async function CreateOrder(params) {
    return request(`dmapi/CreateOrder`,{
        method: 'POST',
        body: params
    });
}
/*资金明细*/
export async function CapitalFlow(params) {
    return request(`app/CapitalFlow`,{
        method: 'POST',
        body: params
    });
}
/*我的策略*/
export async function GetOrderList(params) {
    return request(`dmapi/GetOrderList`,{
        method: 'POST',
        body: params
    });
}
/*设置止损止盈*/
export async function SetQuitGainLoss(params) {
    return request(`dmapi/SetQuitGainLoss`,{
        method: 'POST',
        body: params
    });
}
/*获取帮助详情*/
export async function GetNewContent(params) {
    return request(`app/GetNewContent`,{
        method: 'POST',
        body: params
    });
}
/*平仓*/
export async function CloseOrder(params) {
    return request(`dmapi/closeorder`,{
        method: 'POST',
        body: params
    });
}
/*结算单*/
export async function GetCloseOrderList(params) {
    return request(`dmapi/GetCloseOrderList`,{
        method: 'POST',
        body: params
    });
}
