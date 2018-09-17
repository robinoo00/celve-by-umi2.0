import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/submit.less'
import {Flex,Button} from 'antd-mobile'

@CSSModules(styles)

export default class extends PureComponent {
    render() {
        return (
            <div styleName="container">
                <Button
                    type={'primary'}
                    size={'small'}
                >发起策略</Button>
            </div>
        )
    }
}
