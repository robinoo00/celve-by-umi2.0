import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from './styles/myFinish.less'
import {Flex,List} from 'antd-mobile'
import Header from '@/components/header/'
import {connect} from 'dva'
import router from 'umi/router'

@connect()
@CSSModules(styles)

export default class extends PureComponent {
    state = {
        list:null
    }
    componentDidMount(){
        this._getData()
    }
    _getData = () => {
        const {dispatch} = this.props
        dispatch({
            type:'personal/getCloseOrders'
        }).then(data => {
            if(data){
                this.setState({
                    list:data
                })
            }
        })
    }
    _renderItem = (title,value) => {
        let color = ''
        if(!isNaN(value) && value < 0){
            color = 'down'
        }
        if(!isNaN(value) && value > 0){
            color = 'up'
            value = '+' + value
        }
        return(
            <List.Item>
                <Flex>
                    <Flex.Item>{title}</Flex.Item>
                    <Flex.Item data-color={color}>{value}</Flex.Item>
                </Flex>
            </List.Item>
        )
    }
    _link = (item) => () =>{
        const {dispatch} = this.props
        const test = dispatch({
            type:'personal/assignFinishDetail',
            data:item
        })
        router.push('/personal/finishDetail')
    }
    _rendeSection = (item) => {
        const earn = (item.ClosePrice * item.Volume - item.OpenPrice * item.Volume).toFixed(2)
        return (
            <List styleName="item" key={item.OrderID}>
                <List.Item
                    styleName="info"
                    arrow={'horizontal'}
                    onClick={this._link(item)}
                >
                    <span>{item.Code}</span>
                    <span>{item.Symbol}</span>
                    <span>持仓{item.holdDays}天</span>
                </List.Item>
                <List styleName="con">
                    {this._renderItem('策略编号',`CL${item.OrderID}`)}
                    {this._renderItem('策略类型','T+1')}
                    {this._renderItem('策略类型',`${item.Volume}股`)}
                    {this._renderItem('交易盈亏',earn)}
                    {this._renderItem('盈利分配',item.Profit.toFixed(2))}
                </List>
            </List>
        )
    }
    render() {
        const {list} = this.state
        if(!list) return null
        return (
            <div styleName="container">
                <Header
                    title={'已完成策略'}
                />
                {list.map(item => (
                    this._rendeSection(item)
                ))}
            </div>
        )
    }
}
