import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/item.less'
import {Flex} from 'antd-mobile'
import {connect} from 'dva'
import router from 'umi/router'
import {SEARCH_HISTORY} from '@/utils/params'

@connect()
@CSSModules(styles)

export default class extends PureComponent {
    _collect = (code) => () => {
        const {dispatch} = this.props
        dispatch({
            type:'search/add',
            code:code
        })
    }
    _link = (data) => () => {
        const history = localStorage.getItem(SEARCH_HISTORY)
        let list = JSON.parse(history)
        list.push(data)
        console.log(list)
        // router.push({pathname:'/trade'})
    }
    render() {
        const {data} = this.props
        return (
            <Flex styleName="container" onClick={this._link(data)}>
                <Flex styleName="info">
                    <div>{data.代码}</div>
                    <div>{data.名称}</div>
                </Flex>
                <Flex.Item styleName="collect" onClick={this._collect(data.代码)}>

                </Flex.Item>
            </Flex>
        )
    }
}
