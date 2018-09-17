import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/exponent.less'
import {Flex} from 'antd-mobile'
import {MarketPrice} from '@/services/api'
import {connect} from 'dva'

@CSSModules(styles)

export default class extends PureComponent {
    id = 0
    state = {
        list:[
            {title:'上证指数',value:0,increase:0,percents:0,key:'上证'},
            {title:'深证指数',value:0,increase:0,percents:0,key:'深证'},
            {title:'创业指数',value:0,increase:0,percents:0,key:'创业板'}
        ]
    }

    componentDidMount() {
        this._getData()
        this.id = setInterval(this._getData,3000)
    }

    _getData = () => {
        MarketPrice().then(data => {
            if(data.rs){
                let list = this.state.list
                for(let item of list){
                    const key = item['key']
                    item['value'] = data[key].最新价
                    item['increase'] = data[key].涨跌
                    item['percents'] = (data[key].涨跌 / data[key].最新价 * 100).toFixed(2)
                }
                this.setState({
                    list:[...list]
                })
            }
        })
    }

    render() {
        const {list} = this.state
        if(!list) return null
        return (
            <Flex styleName="container" data-type="section">
                {list.map(item => (
                    <Flex.Item styleName="item" key={item.key}>
                        <div styleName="title">{item.title}</div>
                        <div styleName="total" data-color={item.increase > 0 ? "up" : "down"}>{item.value}</div>
                        <Flex styleName="detail" data-color={item.increase > 0 ? "up" : "down"}>
                            <div styleName="num">{item.increase}</div>
                            <div styleName="percents">{item.percents}%</div>
                        </Flex>
                    </Flex.Item>
                ))}
                {/*<Flex.Item styleName="item">*/}
                    {/*<div styleName="title">创业指数</div>*/}
                    {/*<div styleName="total" data-color="down">{data.创业板.最新价}</div>*/}
                    {/*<Flex styleName="detail" data-color="down">*/}
                        {/*<div styleName="num">{data.创业板.最新价}</div>*/}
                        {/*<div styleName="percents">{((data.创业板.涨跌 / data.创业板.最新价) *100).toFixed(2)}%</div>*/}
                    {/*</Flex>*/}
                {/*</Flex.Item>*/}
                {/*<Flex.Item styleName="item">*/}
                    {/*<div styleName="title">深证指数</div>*/}
                    {/*<div styleName="total">{data.深证.最新价}</div>*/}
                    {/*<Flex styleName="detail">*/}
                        {/*<div styleName="num">{data.深证.最新价}</div>*/}
                        {/*<div styleName="percents">{((data.深证.涨跌 / data.深证.最新价) *100).toFixed(2)}%</div>*/}
                    {/*</Flex>*/}
                {/*</Flex.Item>*/}
            </Flex>
        )
    }
}
