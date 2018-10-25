import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from './styles/finishDetail.less'
import {Flex, List} from 'antd-mobile'
import Header from '@/components/header/'
import {connect} from 'dva'
import router from 'umi/router'

@connect(({personal, base}) => ({
    data: personal.finishDetail,
    config: base.config
}))
@CSSModules(styles)

export default class extends PureComponent {
    details = [
        {title: '股票名称', key: 'Symbol', value: '-'},
        {title: '交易本金', key: 'TotalFunds', value: '-'},
        {title: '买入价格', key: 'OpenPrice', value: '-'},
        {title: '买入类型', key: '', value: '即时买入'},
        {title: '卖出价格', key: 'ClosePrice', value: '-'},
        {title: '卖出类型', key: '', value: '即时成交'},
        {title: '买入时间', key: 'CheckTime', value: '-'},
        {title: '卖出时间', key: 'CloseTime', value: '-'},
        {title: '持仓天数', key: 'holdDays', value: '-', unit: '天'},
        {title: '交易数量', key: 'Volume', value: '-', unit: '股'},
        {title: '综合费', key: 'OpenFee', value: '-'},
        {title: '递延费', key: 'DeferFeeCount', value: '-'},
    ]
    state = {
        config: null
    }

    componentDidMount() {
        const {config, dispatch} = this.props
        if (!config) {
            dispatch({
                type: 'base/getConifg'
            })
        }
    }

    _assignDetailData = () => {
        const {data} = this.props
        const details = this.details
        for (let item of details) {
            if (item.key) {
                item['value'] = data[item['key']]
                if (item.key === 'CheckTime' || item.key === 'CloseTime') {
                    item['value'] = data[item['key']].substr(0, 10)
                }
            }
        }
    }
    _renderDetails = () => {
        this._assignDetailData()
        const details = this.details
        return (
            <Flex styleName={'detail'} justify={'between'} wrap={'wrap'}>
                {details.map(item => (
                    <Flex.Item key={item.title}>
                        <span>{item.title}</span>
                        <span>{item.value}</span>
                    </Flex.Item>
                ))}
            </Flex>
        )
    }
    _renderShare = () => {
        const {data} = this.props
        const 策略盈亏 = (data.ClosePrice * data.Volume - data.OpenPrice * data.Volume).toFixed(2)
        const color = 策略盈亏 > 0 ? 'up' : 'down'
        const list = [
            {title: '策略盈亏', value: 策略盈亏, color: color},
            {title: '亏损赔付', value: 策略盈亏, color: color},
            {title: '盈利分配', value: 0.00}
        ]
        return (
            <List
                renderHeader={'盈利分配'}
            >
                {list.map(item => (
                    <List.Item styleName={'item'} key={item.title}>
                        <Flex styleName={'share'}>
                            <Flex.Item>{item.title}</Flex.Item>
                            <Flex.Item data-color={item.color}>{item.value}</Flex.Item>
                        </Flex>
                    </List.Item>
                ))}
            </List>
        )
    }
    _renderClear = () => {
        const {data,config} = this.props
        if(!config) return null
        const 扣减 = ((data.ClosePrice - data.OpenPrice) * data.Volume * 0.9).toFixed(2)
        const ganggan = parseFloat(config.strRisk.levers.value)
        const dongjie = Math.round(data.TotalFunds / ganggan)
        const 退回 = (dongjie + ((data.ClosePrice - data.OpenPrice) * data.Volume * 0.9)).toFixed(2)
        const list = [
            {title: '冻结', value: data.TotalFunds},
            {title: '扣减', value: 扣减, color: 'donw'},
            {title: '退回', value: 退回}
        ]
        return (
            <List
                renderHeader={'资金结算'}
            >
                {list.map(item => (
                    <List.Item styleName={'item'} key={item.title}>
                        <Flex styleName={'share'}>
                            <Flex.Item>{item.title}</Flex.Item>
                            <Flex.Item data-color={item.color}>{item.value}</Flex.Item>
                        </Flex>
                    </List.Item>
                ))}
            </List>
        )
    }

    render() {
        const {data} = this.props
        return (
            <div styleName="container">
                <Header
                    title={'策略详情'}
                />
                <List
                    renderHeader={'策略交易号'}
                >
                    <List.Item styleName={'item'}>
                        <Flex styleName={'brief'} justify={'between'}>
                            <Flex.Item>
                                <span>CL{data.OrderID}</span>
                                <span>T+1</span>
                            </Flex.Item>
                            <Flex.Item onClick={() => {router.push('/personal/agreement')}}>
                                合约协议
                            </Flex.Item>
                        </Flex>
                    </List.Item>
                </List>
                <List
                    renderHeader={'交易明细'}
                >
                    <List.Item styleName={'item'}>
                        {this._renderDetails()}
                    </List.Item>
                </List>
                {this._renderShare()}
                {this._renderClear()}
            </div>
        )
    }
}
