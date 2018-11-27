import {PureComponent} from 'react'
import styles from '../../styles/pan.less'
import {Flex} from 'antd-mobile'
import {connect} from 'dva'
import {GetShares} from '@/services/api'

const Item = Flex.Item

@connect()

export default class extends PureComponent {
    state = {
        data:null
    }
    componentDidMount(){
        const params = {
            code:this.props.code
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
        const list1 = [
            {title:'今开',key:'今日开盘价'},
            {title:'涨跌',key:'涨跌'},
            {title:'最高',key:'今日最高价'},
            {title:'昨收',key:'昨日收盘价'},
            {title:'跌停',key:'跌停'},
            {title:'最低',key:'今日最低价'},
            {title:'振幅',key:'振幅'},
            {title:'总手',key:'总手'},
            {title:'总量',key:'成交金额'},
        ]
        const list2 = [
            {title:'卖1',key1:'卖一报价',key2:'卖一'},
            {title:'买1',key1:'买一报价',key2:'买一'},
            {title:'卖2',key1:'卖二报价',key2:'卖二'},
            {title:'买2',key1:'买二报价',key2:'买二'},
            {title:'卖3',key1:'卖三报价',key2:'卖三'},
            {title:'买3',key1:'买三报价',key2:'买三'},
            {title:'卖4',key1:'卖四报价',key2:'卖四'},
            {title:'买4',key1:'买四报价',key2:'买四'},
            {title:'卖5',key1:'卖五报价',key2:'卖五'},
            {title:'买5',key1:'买五报价',key2:'买五'}
        ]
        return (
            <div className={styles["container"]} style={{height:height * 2 + 'px'}}>
                <Flex wrap="wrap" justify={"around"} className={styles['top']}>
                    {list1.map(item => (
                        <Item className={styles['item']} key={item.title}>{item.title} {reData[item.key]}</Item>
                    ))}
                </Flex>
                <Flex wrap="wrap" justify={"between"} className={styles['bot']}>
                    {list2.map(item => (
                        <Flex className={styles['item']} key={item.title}>
                            <Item>{item.title}</Item>
                            <Item>{reData[item.key1]}</Item>
                            <Item>{reData[item.key2]}</Item>
                        </Flex>
                    ))}
                </Flex>
            </div>
        )
    }
}
