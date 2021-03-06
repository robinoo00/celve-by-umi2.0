import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../../styles/search.less'
import {Flex} from 'antd-mobile'
import {connect} from 'dva'
import router from 'umi/router'
import {SEARCH_HISTORY} from '@/utils/params'
import {SelectedStockList} from '@/services/api'

@connect(({optional}) => ({
    codes:optional.codes
}))
@CSSModules(styles)

export default class extends PureComponent {
    _getCodes = () => {
        SelectedStockList().then(data => {
            let codes = []
            for(let item of data){
                codes.push(item.code)
            }
            this.setState({
                codes:codes
            })
        })
    }
    _collect = (code) => (e) => {
        e.stopPropagation();
        const {dispatch} = this.props
        dispatch({
            type:'search/collect',
            code:code
        }).then(rs => {
            if(rs){
                dispatch({
                    type:'optional/getList'
                })
            }
        })
    }
    _link = (data) => () => {
        const history = localStorage.getItem(SEARCH_HISTORY)
        let list = []
        if(history){
            list = JSON.parse(history)
        }
        const item = list.filter(item => item.编号 === data.编号)
        if(item.length === 0){
            list.push(data)
            localStorage.setItem(SEARCH_HISTORY,JSON.stringify(list))
        }
        router.push({pathname:'/trade',query:{code:data.代码}})
    }
    render() {
        const {data,codes} = this.props
        return (
            <Flex styleName="item" onClick={this._link(data)}>
                <Flex styleName="info">
                    <div>{data.代码}</div>
                    <div>{data.名称}</div>
                </Flex>
                <Flex.Item styleName={codes.includes(data.代码.toUpperCase()) ? 'collected' : 'collect'} onClick={this._collect(data.代码)}>

                </Flex.Item>
            </Flex>
        )
    }
}
