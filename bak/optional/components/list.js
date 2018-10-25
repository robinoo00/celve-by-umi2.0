import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/list.less'
import {Flex} from 'antd-mobile'
import {SelectedStockList} from '@/services/api'
import router from 'umi/router'
import {connect} from 'dva'

@connect(({optional}) => ({
    list:optional.list
}))
@CSSModules(styles)

export default class extends PureComponent {
    sid = 0
    componentDidMount(){
        this._getData()
        this.sid = setInterval(this._getData,3000)
    }
    componentWillUnmount(){
        clearInterval(this.sid)
    }
    _getData = () => {
        const {dispatch} = this.props
        dispatch({
            type:'optional/getList'
        })
    }
    _renderItem = (data) => {
        const percent = data.updown.split('%')[0]
        return (
            <Flex styleName="item" key={data.code} onClick={() => {router.push({pathname:'trade',query:{code:'CLX8'}})}}>
                <Flex.Item>
                    <div>{data.name || '暂无'}</div>
                    <div styleName="no">{data.code}</div>
                </Flex.Item>
                <Flex.Item data-color={percent > 0 ? 'up' : 'down'}>
                    {data.price || '-'}
                </Flex.Item>
                <Flex.Item data-color={percent > 0 ? 'up' : 'down'}>
                    {data.updown || '-'}
                </Flex.Item>
            </Flex>
        )
    }
    render() {
        const {list} = this.props
        return (
            <div styleName="container">
                <Flex styleName="item">
                    <Flex.Item>
                        股票名称
                    </Flex.Item>
                    <Flex.Item>
                        当前价
                    </Flex.Item>
                    <Flex.Item>
                        涨跌
                    </Flex.Item>
                </Flex>
                {list.map(item => this._renderItem(item))}
            </div>
        )
    }
}
