import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/switch.less'
import {Flex, Button} from 'antd-mobile'
import router from 'umi/router'
import {TRADE_CODE} from '@/utils/params'
import {alert, modal} from '@/utils/common'
import {connect} from 'dva'

@connect(({optional}) => ({
    collectList: optional.list
}))
@CSSModules(styles)

export default class extends PureComponent {
    state = {
        data: null,
        collected: false,
    }
    sid = 0
    /*
    * 获取股票信息
    * 1 从本地获取code 即最近点击过的一次
    * 2 如果没 从收藏列表第一条获取code
    * 3 如果没 从搜索列表 a 关键词 第一条获取code
    * */
    componentDidMount() {
        const code = this.props.code
        this.init(code)
    }
    init = (code) => {
        clearInterval(this.sid)
        this._judgeCollect(code) //判断是否收藏
        this._getData(code)
        this.sid = setInterval(() => {
            this._getData(code)
        },1000)
    }
    componentDidUpdate(prevProps, prevState) {
        if(prevState.code != this.state.code){
            this.init(this.state.code)
        }
    }
    static getDerivedStateFromProps(props,state){
        if(props.code && props.code != state.code){
            return {
                code:props.code,
                data:null
            }
        }
        return null
    }
    componentWillUnmount(){
        clearInterval(this.sid)
    }

    _judgeCollect = (code) => {
        return new Promise(resolve => {
            const list = this.props.collectList
            const item = list.filter(item => item.code.toLowerCase() === code.toLowerCase())[0]
            if (item) {
                this._assignCollected(true)
            } else {
                this._assignCollected(false)
            }
            resolve(code)
        })
    }
    _getData = (code) => {
        return new Promise(resolve => {
            const {dispatch} = this.props
            dispatch({
                type:'base/GetShares',
                code:code
            }).then(data => {
                if(data){
                    this.setState({
                        data: data[0]
                    })
                }else{
                    clearInterval(this.sid)
                    modal(`${code}的股票信息获取失败`, () => {
                        router.push('/optional')
                    })
                }
            })
        })
    }
    _assignCollected = (bool) => {
        this.setState({
            collected: bool
        })
    }
    _collect = (code) => () => {
        const {dispatch} = this.props
        const {collected} = this.state
        if (collected) {//删除
            dispatch({
                type: 'optional/remove',
                code: code
            }).then(rs => {
                if (rs) this._assignCollected(false)
            })
        } else {//收藏
            dispatch({
                type: 'search/collect',
                code: code
            }).then(rs => {
                if (rs) this._assignCollected(true)
            })
        }
    }

    render() {
        const {data, collected} = this.state
        if (!data) return null
        let increase = 0
        let percents = 0
        let color = 'grey'
        if (data.今日开盘价 != 0) {
            increase = data.当前价格 - data.昨日收盘价
            increase = Math.round(increase * 100) / 100
            percents = increase / data.昨日收盘价
            percents = (percents * 100).toFixed(2)
            if (increase > 0) {
                color = 'up'
            }
            if (increase < 0) {
                color = 'down'
            }
        }
        return (
            <Flex styleName="container" data-type="section">
                <Flex.Item styleName="info">
                    <Flex styleName="name">
                        <div>{data.股票名称}<span styleName={collected ? "collected" : "collect"}
                                              onClick={this._collect(data.股票代码)}></span></div>
                    </Flex>
                    <div>{data.今日开盘价 === 0 ? '(已停牌)' : null}</div>
                    <div styleName="no">{data.股票代码}</div>
                </Flex.Item>
                <Flex styleName="con" data-color={color}>
                    <Flex.Item styleName="value">
                        {Math.round(data.当前价格 * 10) / 10}
                    </Flex.Item>
                    <Flex.Item styleName="details">
                        <div>{increase}</div>
                        <div>{percents}%</div>
                    </Flex.Item>
                </Flex>
                <Flex.Item styleName="submit" onClick={() => {
                    router.push('optional/search')
                }}>
                    <Button
                        type={'primary'}
                        size={'small'}
                    >
                        更换股票
                    </Button>
                </Flex.Item>
            </Flex>
        )
    }
}
