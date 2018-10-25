import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../../styles/search.less'
import {Flex,InputItem} from 'antd-mobile'
import {connect} from 'dva'

@connect()
@CSSModules(styles)

export default class extends PureComponent {
    _change = (val) => {
        const {dispatch} = this.props
        if(val){
            dispatch({
                type:'search/assignSearching',
                bool:true
            })
            dispatch({
                type:'search/search',
                code:val
            })
        }else{
            dispatch({
                type:'search/assignSearching',
                bool:false
            })
        }
    }
    render() {
        return (
            <div styleName="input">
                <InputItem
                    placeholder={'输入股票名称/代码/简拼'}
                    onChange={this._change}
                />
            </div>
        )
    }
}
