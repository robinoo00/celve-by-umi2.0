import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/nav.less'
import {Flex} from 'antd-mobile'
import router from 'umi/router'

@CSSModules(styles)

export default class extends PureComponent {
    render() {
        return (
            <Flex styleName="container" data-type="section">
                <Flex onClick={() => {router.push('/trade')}}>
                    <div styleName="icon"></div>
                    <div styleName="con">
                        <div>策略</div>
                        <div>A股点买</div>
                    </div>
                </Flex>
                <Flex onClick={() => {router.push('/optional')}}>
                    <div styleName="icon"></div>
                    <div styleName="con">
                        <div>自选</div>
                        <div>A股点买</div>
                    </div>
                </Flex>
                <Flex onClick={() => {router.push('/personal/financialDetails')}}>
                    <div styleName="icon"></div>
                    <div styleName="con">
                        <div>明细</div>
                        <div>A股点买</div>
                    </div>
                </Flex>
            </Flex>
        )
    }
}
