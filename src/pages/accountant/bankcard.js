import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from './styles/bankcard.less'
import {Flex} from 'antd-mobile'
import Header from '@/components/header/'
import router from 'umi/router'
import {connect} from 'dva'

@connect(({personal}) => ({
    data:personal.data
}))
@CSSModules(styles)

export default class extends PureComponent {
    render() {
        const {data} = this.props
        return (
            <div>
                <Header
                    title={'银行卡'}
                    rightText={<div onClick={() => {router.push({pathname:'/settings/bank',query:{type:'modify'}})}}>更换银行卡</div>}
                />
                <div styleName="card-wrap">
                    <Flex styleName="card">
                        <Flex.Item styleName="icon">
                            <img src={'http://47.100.236.123:6601/dianmai/images/20171228101943.jpg'} alt=""/>
                        </Flex.Item>
                        <Flex.Item styleName="info">
                            <div>{data.银行}</div>
                            <div>储蓄卡</div>
                            <div><span>**** **** ****</span> <span>{data.卡号.slice(-3)}</span></div>
                        </Flex.Item>
                    </Flex>
                    <div styleName="tip">
                        <p>温馨提示:</p>
                        <p>1）只能绑定一张银行卡；</p>
                        <p>2）绑定后只能使用该卡提现；</p>
                    </div>
                </div>
            </div>
        )
    }
}
