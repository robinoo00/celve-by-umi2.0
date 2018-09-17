import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/input.less'
import {Flex,InputItem} from 'antd-mobile'

@CSSModules(styles)

export default class extends PureComponent {
    render() {
        return (
            <div styleName="container">
                <InputItem
                    placeholder={'输入股票名称/代码/简拼'}
                />
            </div>
        )
    }
}
