import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/dynamic-list.less'
import {Flex,Button} from 'antd-mobile'
import person from '@/assets/person.png'

@CSSModules(styles)

export default class extends PureComponent {
    render() {
        return (
            <div styleName="container">
                <Flex styleName="item">
                    <Flex.Item>
                        <Flex>
                            <div styleName="headimg">
                                <img src={person} alt=""/>
                            </div>
                            <div styleName="nickname">
                                昵称111111
                            </div>
                        </Flex>
                        <Flex styleName="detail">
                            <div>16秒前</div>
                            <div>金牛化</div>
                        </Flex>
                    </Flex.Item>
                    <Flex.Item styleName="submit">
                        <Button type={'primary'} size={'small'}>点买</Button>
                    </Flex.Item>
                </Flex>
                <Flex styleName="item">
                    <Flex.Item>
                        <Flex>
                            <div styleName="headimg">
                                <img src={person} alt=""/>
                            </div>
                            <div styleName="nickname">
                                昵称111111
                            </div>
                        </Flex>
                        <Flex styleName="detail">
                            <div>16秒前</div>
                            <div>金牛化</div>
                        </Flex>
                    </Flex.Item>
                    <Flex.Item styleName="submit">
                        <Button type={'primary'} size={'small'}>点买</Button>
                    </Flex.Item>
                </Flex>
            </div>
        )
    }
}
