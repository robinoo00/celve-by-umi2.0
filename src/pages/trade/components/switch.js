import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/switch.less'
import {Flex,Button} from 'antd-mobile'

@CSSModules(styles)

export default class extends PureComponent {
    render() {
        return (
            <Flex styleName="container" data-type="section">
                <Flex.Item styleName="info">
                    <Flex styleName="name">
                        <div>万科a</div>
                        <div styleName="collect"></div>
                    </Flex>
                    <div styleName="no">000002.SZ</div>
                </Flex.Item>
                <Flex styleName="con" data-color="down">
                    <Flex.Item styleName="value">
                        23.5
                    </Flex.Item>
                    <Flex.Item styleName="details">
                        <div>-0.04</div>
                        <div>-0.09%</div>
                    </Flex.Item>
                </Flex>
                <Flex.Item styleName="submit">
                    <Button
                        type={'primary'}
                        size={'small'}
                    >
                        更换股票
                    </Button>
                </Flex.Item>
            </Flex>
        )
    }
}
