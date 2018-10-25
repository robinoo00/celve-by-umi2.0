import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/submit.less'
import {Flex,Button} from 'antd-mobile'
import {TRADE_CONFIRM_DATA} from '@/utils/params'
import router from 'umi/router'
import {connect} from 'dva'

@connect(({base}) => ({
    config:base.config,
    canTrade:base.canTrade
}))
@CSSModules(styles)

export default class extends PureComponent {
    componentDidMount(){
        const {config,dispatch} = this.props
        if(!config){
            dispatch({
                type:'base/getConfig'
            })
        }
    }
    render() {
        const {canTrade,code} = this.props
        return (
            <div styleName="container">
                <Button
                    type={'primary'}
                    size={'small'}
                    disabled={!canTrade}
                    onClick={
                        () => {
                            router.push({
                                pathname:'trade/confirm',
                                query:{code:code}
                            })
                        }
                    }
                >{canTrade ? '发起策略' : '非交易时段'}</Button>
            </div>
        )
    }
}
