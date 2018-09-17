import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/allocation-list.less'
import {Flex} from 'antd-mobile'

@CSSModules(styles)

export default class extends PureComponent {
    render() {
        return (
            <div styleName="container">
                <div styleName="item">
                    <Flex styleName="info">
                        <div>
                            昵称
                        </div>
                        <div>
                            盈利<span data-color="up">202.5</span>元
                        </div>
                    </Flex>
                    <Flex styleName="detail">
                        <div>20秒前</div>
                        <div>20秒前</div>
                        <div>20秒前</div>
                    </Flex>
                </div>
            </div>
        )
    }
}
