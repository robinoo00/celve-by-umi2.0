import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../../styles/pan.less'
import {Flex} from 'antd-mobile'
import {connect} from 'dva'
import {GetShares} from '@/services/api'

const Item = Flex.Item

@connect(({routing}) => ({
    code:routing.location.query.code
}))
@CSSModules(styles)

export default class extends PureComponent {
    state = {
        data:null
    }
    componentDidMount(){
        const params = {
            code:'SH600139',
            async:false
        }
        this._getData(params)
    }
    _getData = (params) => {
        GetShares(params).then(data => {
            this.setState({
                data:data[0]
            })
        })
    }
    _rebuildData = data => {
        data.振幅 = ((data.今日最高价 - data.今日最低价) / data.昨日收盘价).toFixed(2) + '%'
        const dealTotal = data.成交的股票数 / 100
        data.总手 = dealTotal > 10000 ? Math.round(dealTotal / 100) / 100 + '万' : Math.round(dealTotal * 100) / 100
        const dealMoney = data.成交金额
        data.成交金额 = dealMoney > 100000000 ? Math.round(dealMoney / 1000000) / 100 + '亿' : dealMoney
        data.成交金额 = dealMoney > 10000 ? Math.round(dealMoney / 100) / 100 + '万' : dealMoney
        data.涨跌 = data.昨日收盘价 * 1.1
        data.跌停 = data.昨日收盘价 * 0.9
        const keys = Object.keys(data)
        for(let key of keys){
            if(!isNaN(data[key])){
                data[key] = Math.round(data[key] * 100) / 100
            }
            if(key.length === 2 && ['一','二','三','四','五'].includes([...key][1])){
                data[key] = Math.floor(data[key] / 100)
            }
        }
        return data
    }
    render() {
        const {data} = this.state
        const {height} = this.props
        if(!data) return null
        const reData = this._rebuildData(data)
        return (
            <div styleName="container" style={{height:height * 2 + 'px'}}>
                <Flex wrap="wrap" justify={"around"} styleName={'top'}>
                    <Item styleName='item'>今开 {reData.今日开盘价}</Item>
                    <Item styleName='item'>涨跌 {reData.涨跌}</Item>
                    <Item styleName='item'>最高 {reData.今日最高价}</Item>
                    <Item styleName='item'>昨收 {reData.昨日收盘价}</Item>
                    <Item styleName='item'>跌停 {reData.跌停}</Item>
                    <Item styleName='item'>最低 {reData.今日最低价}</Item>
                    <Item styleName='item'>振幅 {reData.振幅}</Item>
                    <Item styleName='item'>总手 {reData.总手}</Item>
                    <Item styleName='item'>总量 {reData.成交金额}</Item>
                </Flex>
                <Flex wrap="wrap" justify={"between"} styleName={'bot'}>
                    <Flex styleName='item'>
                        <Item>卖1</Item>
                        <Item>{reData.卖一报价}</Item>
                        <Item>{reData.卖一}</Item>
                    </Flex>
                    <Flex styleName='item'>
                        <Item>买1</Item>
                        <Item>{reData.买一报价}</Item>
                        <Item>{reData.买一}</Item>
                    </Flex>
                    <Flex styleName='item'>
                        <Item>卖2</Item>
                        <Item>{reData.卖二报价}</Item>
                        <Item>{reData.卖二}</Item>
                    </Flex>
                    <Flex styleName='item'>
                        <Item>买2</Item>
                        <Item>{reData.买二报价}</Item>
                        <Item>{reData.买二}</Item>
                    </Flex>
                    <Flex styleName='item'>
                        <Item>卖3</Item>
                        <Item>{reData.卖三报价}</Item>
                        <Item>{reData.卖三}</Item>
                    </Flex>
                    <Flex styleName='item'>
                        <Item>买3</Item>
                        <Item>{reData.买三报价}</Item>
                        <Item>{reData.买三}</Item>
                    </Flex>
                    <Flex styleName='item'>
                        <Item>卖4</Item>
                        <Item>{reData.卖四报价}</Item>
                        <Item>{reData.卖四}</Item>
                    </Flex>
                    <Flex styleName='item'>
                        <Item>买4</Item>
                        <Item>{reData.买四报价}</Item>
                        <Item>{reData.买四}</Item>
                    </Flex>
                    <Flex styleName='item'>
                        <Item>卖5</Item>
                        <Item>{reData.卖五报价}</Item>
                        <Item>{reData.卖五}</Item>
                    </Flex>
                    <Flex styleName='item'>
                        <Item>买5</Item>
                        <Item>{reData.买五报价}</Item>
                        <Item>{reData.买五}</Item>
                    </Flex>
                </Flex>
            </div>
        )
    }
}
