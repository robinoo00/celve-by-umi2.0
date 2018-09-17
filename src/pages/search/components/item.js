import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/item.less'
import {Flex} from 'antd-mobile'

@CSSModules(styles)

export default class extends PureComponent {
    render() {
        return (
            <Flex styleName="container">
                <Flex styleName="info">
                    <div>000001</div>
                    <div>平安银行</div>
                </Flex>
                <Flex.Item styleName="collect">

                </Flex.Item>
            </Flex>
        )
    }
}
