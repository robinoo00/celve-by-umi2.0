import {PureComponent} from 'react'
import {Flex} from 'antd-mobile'
import Header from './components/header'
import Exponent from '../home/components/exponent'
import List from './components/list'

export default class extends PureComponent {
    render() {
        return (
            <>
                <Header/>
                <Exponent/>
                <List/>
            </>
        )
    }
}
