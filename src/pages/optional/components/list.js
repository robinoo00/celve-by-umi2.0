import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/list.less'
import {Flex} from 'antd-mobile'

@CSSModules(styles)

export default class extends PureComponent {
    render() {
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
                <Flex styleName="item">
                    <Flex.Item>
                        <div>名称</div>
                        <div styleName="no">sz0000222</div>
                    </Flex.Item>
                    <Flex.Item data-color="up">
                        18.93
                    </Flex.Item>
                    <Flex.Item data-color="down">
                        0.71
                    </Flex.Item>
                </Flex>
            </div>
        )
    }
}
