import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/header.less'
import {Flex} from 'antd-mobile'
import Header from '@/components/header/'
import router from 'umi/router'

@CSSModules(styles)

export default class extends PureComponent {
    render() {
        return (
            <Header
                title={
                    <div styleName="tabs">
                        <span>策略创建</span>
                        <span styleName="off" onClick={() =>{router.push('personal/myTrade')}}>持仓策略</span>
                    </div>
                }
                rightText={<div onClick={() => {router.push('trade/rule')}}>规则</div>}
            />
        )
    }
}
