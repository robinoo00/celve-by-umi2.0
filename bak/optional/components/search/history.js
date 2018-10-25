import {PureComponent} from 'react'
import {Flex} from 'antd-mobile'
import Item from './item'
import CSSModules from 'react-css-modules'
import styles from '../../styles/search.less'
import {SEARCH_HISTORY} from '@/utils/params'
import {connect} from 'dva'

@connect()
@CSSModules(styles)

export default class extends PureComponent {
    state = {
        change:true
    }
    componentDidMount(){
        const {dispatch} = this.props
        dispatch({
            type:'optional/getList'
        })
    }
    _clear = () => {
        localStorage.removeItem(SEARCH_HISTORY)
        this.setState({
            change:!this.state.change
        })
    }
    render() {
        let list = localStorage.getItem(SEARCH_HISTORY)
        if(list) list = JSON.parse(list)
        return (
            <div>
                {list ? <>
                    {list.map(item => (
                        <Item
                            key={item.编号}
                            data={item}
                        />
                    ))}
                </> : null}
                <div styleName="clear" onClick={this._clear}>清楚搜索历史</div>
            </div>
        )
    }
}
