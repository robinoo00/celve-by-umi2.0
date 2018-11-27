import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from './styles/confirm.less'
import {Flex, List, Button, InputItem} from 'antd-mobile'
import Header from '@/components/header/'
import {GetShares, TradeConfig, CreateOrder} from '@/services/api'
import {connect} from 'dva'
import Submit from '@/components/submit/'
import {alert,modal} from '@/utils/common'
import router from 'umi/router'

const Item = Flex.Item
const LItem = List.Item

@connect(({routing}) => ({
    code: routing.location.query.code
}))
@CSSModules(styles)

export default class extends PureComponent {
    state = {
        data: null,
        config: null,
        num: 100,
        result: null
    }
    sending = false
    componentDidMount() {
        const params = {
            code: this.props.code,
            async: false
        }
        this._getData(params)
            .then(this._getConfigData)
            .then(this._calculate)
    }

    _getData = (params) => {
        return new Promise((resolve) => {
            GetShares(params).then(data => {
                this.setState({
                    data: data[0]
                }, () => {
                    resolve()
                })
            })
        })
    }
    _getConfigData = () => {
        return new Promise((resolve) => {
            TradeConfig({device: 1}).then(data => {
                this.setState({
                    config: data.datas
                }, () => {
                    resolve()
                })
            })
        })
    }
    _calculate = () => {
        return new Promise(() => {
            const {data, num, config} = this.state
            const strRisk = config.strRisk
            let 点买金额 = data.当前价格 * num * strRisk.tradingCountRatio.value
            点买金额 = Math.ceil(点买金额 / 100) * 100
            let 交易综合费 = 点买金额 / 10000 * strRisk.openFee.value
            // console.log('交易综合费',交易综合费)
            const result = {
                点买金额: 点买金额,
                触发止盈: 点买金额 * strRisk.quitGainRatioList.value,
                // 触发止损:点买金额 / strRisk.levers.value * strRisk.quitLossLineRatio.value
                触发止损: 点买金额 / 8 * 0.8,
                // 递延条件:(点买金额 * strRisk.deferThreshHoldRatio.value) - (点买金额 / strRisk.levers.value),
                递延条件: (点买金额 * strRisk.deferThreshHoldRatio.value) - (点买金额 / 8),
                盈利分成: strRisk.profitShare.value * 100,
                履约保证金: 点买金额 / 8,
                交易综合费: 交易综合费,
                总计: 点买金额 / 8 + 点买金额 / 10000 * strRisk.openFee.value

            }
            const keys = Object.keys(result)
            for (let key of keys) {
                // result[key] = Math.round(result[key] * 100) / 100
                // result[key] = Math.ceil(result[key])
            }
            this.setState({
                result: result
            })
        })
    }
    _renderItem = payload => {
        return (
            <Flex jusityfy={"between"}>
                <Item>{payload.title}</Item>
                <Item align={"end"}>
                    {payload.money ? <><span
                        data-color={payload.money > 0 ? "up" : "down"}>{payload.money}</span>&nbsp;元</> : null}
                    {payload.con ? payload.con : null}
                </Item>
            </Flex>
        )
    }
    _handleNum = (val) => () => {
        let num = this.state.num
        num = num + val <= 100 ? 100 : num + val
        this.assignNum(num)
    }
    assignNum = val => {
        if(isNaN(val)) return
        this.setState({
            num: Number(val)
        },() => {
            this._calculate()
        })
    }
    _submit = () => {
        if(this.sending) return ;
        this.sending = true
        setTimeout(() => {
            this.sending = false
        },500)
        const {result, data, num} = this.state
        const params = {
            money: result.点买金额,
            buyPrice: data.当前价格,
            quitLoss: result.触发止损,
            quitGain: result.触发止盈,
            principal: result.履约保证金,
            fee: result.交易综合费,
            stockCode: data.股票代码,
            volume: num
        }
        CreateOrder(params).then(data => {
            if(data.rs){
                modal(data.msg,() => {
                    router.push('/personal/myTrade')
                })
            }else{
                alert(data.msg)
            }
        })
    }

    render() {
        const {data, num, config, result} = this.state
        if (!result) return null
        return (
            <>
            <Header
                title={'买入委托'}
            />
            <Flex styleName="info" justify={"between"}>
                <Item styleName="name-code">
                    <div>{data.股票名称}</div>
                    <div>{data.股票代码}</div>
                </Item>
                <Item>
                    <span>最新价：</span>
                    <span data-color="up" styleName="total-fee">{data.当前价格}</span>
                </Item>
            </Flex>
            <List>
                <LItem>
                    <Flex styleName="input-num">
                        <Item>数量</Item>
                        <Flex styleName={'con'}>
                            <Flex.Item>
                                <Button type={"primary"} size={"small"} onClick={this._handleNum(-1000)}>-1000</Button>
                            </Flex.Item>
                            <Flex.Item>
                                <Button type={"primary"} size={"small"} onClick={this._handleNum(-100)}>-100</Button>
                            </Flex.Item>
                            <Flex.Item>
                                <InputItem
                                    styleName="input"
                                    value={num}
                                    onChange={this.assignNum}
                                    type={'number'}
                                />
                                {/*<div styleName="input">{num}</div>*/}
                            </Flex.Item>
                            <Flex.Item>
                                <Button type={"primary"} size={"small"} onClick={this._handleNum(100)}>+100</Button>
                            </Flex.Item>
                            <Flex.Item>
                                <Button type={"primary"} size={"small"} onClick={this._handleNum(1000)}>+1000</Button>
                            </Flex.Item>
                        </Flex>
                    </Flex>
                </LItem>
                <LItem
                >
                    {this._renderItem({
                        title: '点买金额',
                        money: result.点买金额
                    })}
                    {this._renderItem({
                        title: '触发止盈',
                        money: result.触发止盈
                    })}
                    {this._renderItem({
                        title: '触发止损',
                        money: -result.触发止损
                    })}
                    {this._renderItem({
                        title: '持仓时间',
                        con: 'T+1'
                    })}
                    {this._renderItem({
                        title: '买入类型',
                        con: '市价买入'
                    })}
                    {/*{this._renderItem({*/}
                        {/*title: '递延条件',*/}
                        {/*con: `盈亏≥${result.递延条件}`*/}
                    {/*})}*/}
                    {this._renderItem({
                        title: '盈利分成',
                        con: result.盈利分成 + '%'
                    })}
                </LItem>
                <LItem>
                    {this._renderItem({
                        title: '交易综合费',
                        money: Math.ceil(result.交易综合费 *100) /100
                    })}
                    {this._renderItem({
                        title: '履约保证金',
                        money: result.履约保证金
                    })}
                </LItem>
            </List>
            <div styleName="total">
                总计： <span data-color="up">{result.总计}</span>元
            </div>
            <Submit
                title={'点买'}
                onClick={this._submit}
            />
            </>
        )
    }
}
