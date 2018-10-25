import {PureComponent} from 'react'
import {Flex} from 'antd-mobile'
import Item from './item'
import {connect} from 'dva'

@connect(({search}) => ({
    list:search.searchResult
}))

export default class extends PureComponent {
    render() {
        const {list} = this.props
        return (
            <div>
                {list.map(item => (
                    <Item
                        key={item.编号}
                        data={item}
                    />
                ))}
            </div>
        )
    }
}
