import {PureComponent} from 'react'
import {Flex} from 'antd-mobile'
import Item from './item'
import CSSModules from 'react-css-modules'
import styles from '../styles/history.less'

@CSSModules(styles)

export default class extends PureComponent {
    render() {
        return (
            <div>
                <Item/>
                <div styleName="clear">清楚搜索历史</div>
            </div>
        )
    }
}
