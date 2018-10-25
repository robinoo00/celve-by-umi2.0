import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from './styles/withdraw.less'
import {Flex,InputItem,WhiteSpace} from 'antd-mobile'
import {createForm} from 'rc-form'
import {connect} from 'dva'
import Header from '@/components/header/'
import Submit from '@/components/submit/'

@createForm()
@connect(({personal}) => ({
    money:personal.data.余额
}))
@CSSModules(styles)

export default class extends PureComponent {
    render() {
        const {form} = this.props
        return (
            <div styleName="container">
                <Header
                    title={'账户提现'}
                />
            <InputItem
                value={111}
            >
                可用资金
            </InputItem>
            <WhiteSpace size={'xl'}/>
            <InputItem
                placeholder={'请输入提现金额'}
                {...form.getFieldProps('money',{
                    rules:[
                        {required: true,message:'请输入提现金额'}
                    ]
                })}
            >提现金额</InputItem>
                <InputItem
                    placeholder={'请输入提现金额'}
                    {...form.getFieldProps('money',{
                        rules:[
                            {required: true,message:'请输入提现金额'}
                        ]
                    })}
                >提现银行卡</InputItem>
                <Submit
                    title={'提现'}
                />
            </div>
        )
    }
}
