import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/header.less'
import {Flex} from 'antd-mobile'
import Header from '@/components/header/'

@CSSModules(styles)

export default class extends PureComponent {
    render() {
        return (
            <Header
                title={
                    <div styleName="tabs">
                        <span>策略创建</span>
                        <span styleName="off">持仓策略</span>
                    </div>
                }
                rightText={'规则'}
            />
        )
    }
}
