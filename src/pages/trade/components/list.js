import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/list.less'
import {Flex,Button} from 'antd-mobile'

@CSSModules(styles)

export default class extends PureComponent {
    render() {
        return (
            <div styleName="container" data-type="section">
                <Flex styleName="item">
                    <Flex.Item>
                        <div styleName="nickname">昵称</div>
                        <Flex styleName="details">
                            <div>啊啊啊啊啊</div>
                            <div>啊啊啊啊啊</div>
                            <div>啊啊啊啊啊</div>
                        </Flex>
                    </Flex.Item>
                    <Flex.Item styleName="submit">
                        <Button
                            type={'primary'}
                            size={'small'}
                        >点买</Button>
                    </Flex.Item>
                </Flex>
            </div>
        )
    }
}
