import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from './styles/tpl.less'
import {Flex} from 'antd-mobile'
import CountDown from '@/components/countDown/'
import K from '../trade/components/k2/'
import {connect} from 'dva'

@connect(({routing}) => ({
    code:routing.location.query.code
}))
@CSSModules(styles)

export default class extends PureComponent {
    render() {
        return (
            <div>
                <K code={this.props.code}/>
            </div>
        )
    }
}
