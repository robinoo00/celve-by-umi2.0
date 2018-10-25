import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from './styles/bank.less'
import {Flex, InputItem, Picker, List} from 'antd-mobile'
import Header from '@/components/header/'
import {banks, provinces} from './components/resource'
import Submit from '@/components/submit'
import {createForm} from 'rc-form'
import {connect} from 'dva'
import CountDown from '@/components/countDown/'
import {ModifyCard} from '@/services/api'
import {alert} from '@/utils/common'

@createForm()
@connect(({certification,routing}) => ({
    cData:{
        name: certification.name,
        idnum: certification.idnum,
        address: certification.address,
        pic1: certification.IDFront.file,
        pic2: certification.IDBack.file,
    },
    type:routing.location.query.type
}))
@CSSModules(styles)

export default class extends PureComponent {
    state = {
        startCountDown:false
    }
    _submit = () => {
        const {form, dispatch,cData,type} = this.props
        form.validateFields({force: true}, (error) => {
            if (!error) {
                let value = form.getFieldsValue();
                let data = {
                    cardnum:value.cardnum,
                    bank:value.bank[0],
                    province:value.city[0],
                    city:value.city[1],
                    bankaddress:value.bankaddress,
                }
                if(type === 'modify'){
                    data['code'] = value.smscode
                    data['cardno'] = value.cardnum
                    this._modify(data)
                }else{
                    data = {
                        ...data,
                        ...cData
                    }
                    dispatch({
                        type:'certification/submit',
                        payload:data
                    })
                }
            } else {
                const errors = Object.values(error);
                alert(errors[0]['errors'][0]['message']);
            }
        });
    }
    _modify = (params) => {
        ModifyCard(params).then(data => {
            alert(data.msg)
        })
    }
    _sendCode = () => {
        this.setState({
            startCountDown:!this.state.startCountDown
        })
    }
    _renderPickBank = () => {
        const {form} = this.props
        return (
            <Picker
                data={banks}
                title="选择银行"
                cascade={false}
                // extra={this.state.bank || "请选择银行"}
                itemStyle={{height: '.8rem', lineHeight: '.8rem', fontSize: '.4rem'}}
                indicatorStyle={{height: '.8rem'}}
                okText={'确定'}
                // value={this.state.bank}
                // onOk={v => this.setState({bank: v})}
                {...form.getFieldProps('bank', {
                    rules: [{
                        required: true, message: '请选择银行',
                    }],
                })}
            >
                <List.Item arrow="horizontal">归属银行</List.Item>
            </Picker>
        )
    }
    _renderPickCity = () => {
        const {form} = this.props
        return (
            <Picker
                data={provinces}
                title="选择省市"
                cols={2}
                // extra={this.state.bank || "选择省市"}
                itemStyle={{height: '.8rem', lineHeight: '.8rem', fontSize: '.4rem'}}
                indicatorStyle={{height: '.8rem'}}
                okText={'确定'}
                // onOk={this._chooseProvince}
                {...form.getFieldProps('city', {
                    initialValue: ['上海', '长宁区'],
                    rules: [{
                        required: true, message: '请选择省市',
                    }],
                })}
            >
                <List.Item arrow="horizontal">开户省份</List.Item>
            </Picker>
        )
    }

    render() {
        const {form} = this.props
        const {startCountDown,phone} = this.state
        return (
            <>
            <Header
                title={'绑定银行卡'}
            />
            <div styleName="inputs">
                <InputItem
                    placeholder={'请输入银行卡号'}
                    {...form.getFieldProps('cardnum', {
                        rules: [{
                            required: true, message: '请输入银行卡号',
                        }],
                    })}
                >
                    银行卡号
                </InputItem>
                {this._renderPickBank()}
                {this._renderPickCity()}
                <InputItem
                    placeholder={'请输入开户支行'}
                    {...form.getFieldProps('bankaddress', {
                        rules: [{
                            required: true, message: '请输入开户支行',
                        }],
                    })}
                >
                    开户支行
                </InputItem>
                <InputItem
                    placeholder={'请输入短信验证码'}
                    extra={<div styleName="send-code" onClick={this._sendCode}>
                        <CountDown
                            connect={startCountDown}
                        />
                    </div>}
                    {...form.getFieldProps('smscode', {
                        rules: [{
                            required: true, message: '请输入短信验证码',
                        }],
                    })}
                >
                    短信验证
                </InputItem>
                <Submit
                    onClick={this._submit}
                    title={'提交'}
                />
            </div>
            </>
        )
    }
}
