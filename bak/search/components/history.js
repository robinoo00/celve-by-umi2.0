import {PureComponent} from 'react'
import {Flex} from 'antd-mobile'
import Item from './item'
import CSSModules from 'react-css-modules'
import styles from '../styles/history.less'
import {SEARCH_HISTORY} from '@/utils/params'

@CSSModules(styles)

export default class extends PureComponent {
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
                <div styleName="clear">清楚搜索历史</div>
            </div>
        )
    }
}
