import {PureComponent} from 'react'
import {Flex} from 'antd-mobile'
import Info from './components/info'
import List from './components/list'
import {connect} from 'dva'

export default class extends PureComponent {
    render() {
        return (
            <>
                <Info/>
                <List/>
            </>
        )
    }
}
