import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from './styles/myTrade.less'
import {Flex, ListView, Button, Modal} from 'antd-mobile'
import Header from '@/components/header/'
import {GetOrderList} from '@/services/api'
import {TradeConfig, CloseOrder} from '@/services/api'
import {isTradeTime, getHeight} from '@/utils/common'
import SetLossGain from './components/setLossGain'
import {alert} from '@/utils/common'
import router from 'umi/router'
import {connect} from 'dva'

const Item = Flex.Item

@connect()
@CSSModules(styles)

export default class extends PureComponent {
    state = {
        list: [],
        data: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        shareData: null,
        config: null,
        setLossGain: false,
        setOrderID: 0
    }

    componentDidMount() {
        this._getData()
            .then(this._getShareData)
            .then(this._getConfigData)
    }

    _getData = () => {
        return new Promise(resolve => {
            GetOrderList().then(re => {
                const get_list = re.datas
                this.setState({
                    data: this.state.data.cloneWithRows(get_list),
                    list: get_list,
                }, () => {
                    resolve()
                })
            })
        })
    }
    _getShareData = () => {
        return new Promise(resolve => {
            const codes = this._getCodes()
            const {dispatch} = this.props
            dispatch({
                type:'base/GetShares',
                code:codes
            }).then(data => {
                if (data.length != 0) {
                    this.setState({
                        shareData: this._reBuildShareData(data)
                    }, () => {
                        resolve()
                    })
                }
            })
        })
    }
    _getCodes = () => {
        const {list} = this.state
        let codes = ''
        for (let item of list) {
            codes += item.Code + ','
        }
        codes = codes.substr(0, codes.length - 1)
        return codes
    }
    _reBuildShareData = (data) => {
        let new_data = {}
        const reg = new RegExp('"');
        for (let item of data) {
            const key = item.股票名称.replace(reg, "")
            new_data[key] = item.当前价格
        }
        return new_data
    }
    _getConfigData = () => {
        return new Promise(resolve => {
            TradeConfig().then(data => {
                this.setState({
                    config: data.datas
                })
            })
        })
    }
    _canTrade = () => {
        const {config} = this.state
        return isTradeTime(config)
    }
    _getState = (state) => {
        const canTrade = this._canTrade()
        let res = ''
        if (!canTrade) {
            res = '非交易时段'
        } else {
            switch (state) {
                case '委托':
                    res = '等待接单'
                    break
                case '接单':
                    res = '平仓'
                    break
                case '流单':
                    res = '流单'
                    break
                default:
                    res = '未知状态'
            }
        }
        return res
    }
    _setGainLoss = (orderID) => () => {
        this.setState({
            setLossGain: true,
            setOrderID: orderID
        })
    }
    _hideSetGainLoss = () => {
        this.setState({
            setLossGain: false,
            setOrderID: 0
        })
    }
    _trade = (item) => () => {
        if (item.holdDays < 1 || item.State != '接单') {
            return
        } else {
            Modal.alert('是否平仓？', '', [
                {
                    text: '取消', onPress: () => {
                    }
                },
                {
                    text: '确定', onPress: () => {
                        CloseOrder({orderid: item.OrderID})
                            .then(data => {
                                alert(data.msg)
                                this._getData()
                            })
                    }
                }
            ])
        }
    }
        renderRow = (item) => {
            const {shareData, config} = this.state
            const 当前价 = shareData[item.Symbol]
            const 点买金额 = 当前价 * item.Volume * config.strRisk.tradingCountRatio.value
            let 递延条件 = (点买金额 * config.strRisk.deferThreshHoldRatio.value) - (点买金额 / config.strRisk.levers.value)
            递延条件 = Math.ceil(递延条件 * 100) / 100
            let 盈利 = (当前价 - item.OpenPrice) * item.Volume
            let color = item.State === '接单' && item.holdDays > 0 ? 'up' : 'grey'
            color = this._canTrade() ? color : 'grey'
            return (
                <div className={styles.item}>
                    <Flex className={styles.header} justify={'between'}>
                        <Item>
                            <span>{item.Code}</span><span>{item.Symbol}</span><span>已持仓{item.holdDays}天</span>
                        </Item>
                        <Item data-color={盈利 > 0 ? 'up' : 'down'}>
                            {盈利.toFixed(2)}
                        </Item>
                    </Flex>
                    <Flex wrap={'wrap'} jusitify={'between'} className={styles.details}>
                        <Item>委托价：{item.UpPrice}</Item>
                        <Item>止盈：{item.QuitGain}</Item>
                        <Item>当前价：{当前价}</Item>
                        <Item>成交价：{item.OpenPrice || '未成交'}</Item>
                        <Item>止损：{item.QuitLoss < 0 ? -item.QuitLoss : item.QuitLoss}</Item>
                        <Item>数量：{item.Volume}</Item>
                    </Flex>
                    <Flex wrap={'wrap'} justify={'between'} className={styles.details2}>
                        <Item>策略编号</Item>
                        <Item>CL{item.OrderID}</Item>
                        <Item>递延条件</Item>
                        <Item style={{color: '#0e80d2'}}>盈亏 ≥ {递延条件}</Item>
                        <Item>成交时间</Item>
                        <Item>{item.CheckTime || '未成交'}</Item>
                    </Flex>
                    <Flex wrap={'wrap'} justify={'between'} className={styles.submit}>
                        <Item>
                            <Button type={'primary'} size={'small'}
                                    onClick={this._setGainLoss(item.OrderID)}>设置止盈止损</Button>
                        </Item>
                        <Item>
                            <Button type={'primary'} size={'small'} data-bgcolor={color}
                                    onClick={this._trade(item)}>{this._getState(item.State)}</Button>
                        </Item>
                    </Flex>
                </div>
            )
        }

        render()
        {
            const {data, config, setLossGain, setOrderID} = this.state;
            if (!config) return <Header
                title={'我的策略'}
            />
            return (
                <>
                <Header
                    title={'我的策略'}
                    rightText={<div onClick={() => {router.push('/personal/myFinish')}}>结算单</div>}
                />
                <SetLossGain
                    visible={setLossGain}
                    hide={this._hideSetGainLoss}
                    orderid={setOrderID}
                />
                <ListView
                    dataSource={data}
                    renderRow={this.renderRow}
                    onEndReachedThreshold={50}
                    onScroll={() => {
                        console.log('scroll');
                    }}
                    scrollRenderAheadDistance={500}
                    showsVerticalScrollIndicator={false}
                    style={{
                        height: getHeight(['header']) + 'px',
                        overflow: 'auto',
                    }}
                />
                </>
            )
        }
    }
