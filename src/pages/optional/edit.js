import {PureComponent} from 'react'
import {Flex} from 'antd-mobile'
import Header from '@/components/header/'
import CSSModules from 'react-css-modules'
import styles from './styles/edit.less'

@CSSModules(styles)

export default class extends PureComponent {
    render() {
        return (
            <>
                <Header
                    title={'我的自选'}
                    leftText={'完成'}
                    iconShow={false}
                    rightText={<div onClick={() => {}}>删除</div>}
                />
                <div styleName="container">
                    <Flex styleName="item">
                        <Flex>
                            <div styleName="choose"></div>
                            <div styleName="info">
                                <div>名称</div>
                                <div styleName="no">00000022</div>
                            </div>
                        </Flex>
                        <Flex.Item styleName='to-top'>

                        </Flex.Item>
                    </Flex>
                    <Flex styleName="item">
                        <Flex>
                            <div styleName="unchoose"></div>
                            <div styleName="info">
                                <div>名称</div>
                                <div styleName="no">00000022</div>
                            </div>
                        </Flex>
                        <Flex.Item styleName='to-top'>

                        </Flex.Item>
                    </Flex>
                </div>
            </>
        )
    }
}
