import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/info.less'
import {Flex,Button} from 'antd-mobile'
import BGIMG from '@/assets/personalBGIMG.jpg'
import person from '@/assets/person.png'

@CSSModules(styles)

export default class extends PureComponent {
    render() {
        return (
            <div styleName="container">
                <img src={BGIMG} styleName="bg"/>
                <div styleName="mask"></div>
                <div styleName="service"></div>
                <div styleName="content">
                    <Flex styleName="detail">
                        <Flex.Item styleName="headimg">
                            <img src={person}/>
                        </Flex.Item>
                        <Flex.Item styleName="account">
                            <div styleName="nickname">昵称</div>
                            <Flex styleName="money">
                                <Flex.Item styleName="money-item">
                                    <span>0</span>
                                    <span>账号余额</span>
                                </Flex.Item>
                                <Flex.Item styleName="money-item">
                                    <span>0</span>
                                    <span>抵用券</span>
                                </Flex.Item>
                            </Flex>
                        </Flex.Item>
                    </Flex>
                    <Flex styleName="actions">
                        <Button type={'primary'}>充值</Button>
                        <Button>提现</Button>
                    </Flex>
                </div>
            </div>
        )
    }
}
