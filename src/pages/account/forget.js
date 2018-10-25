import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from './styles/register.less'
import {Flex,InputItem,WhiteSpace,Button} from 'antd-mobile'
import Header from '@/components/header/'
import {createForm} from 'rc-form'
import {connect} from 'dva'
import {alert} from '@/utils/common'

@createForm()
@connect()
@CSSModules(styles)

export default class extends PureComponent {
    state = {
        seconds:60,
        send_text:'获取验证码',
        can_send:true
    }
    send_id = 1
    _submit = () => {
        const {form, dispatch} = this.props
        form.validateFields({force: true}, (error) => {
            if (!error) {
                let value = form.getFieldsValue();
                delete value['secpwd']
                dispatch({
                    type: 'account/forget',
                    payload: value,
                });
            } else {
                const errors = Object.values(error);
                alert(errors[0]['errors'][0]['message']);
            }
        });
    }
    _sendCode = () => {
        const {dispatch,form} = this.props
        const phone = form.getFieldValue('phone')
        if(phone){
            this._countDown().then(() => {
                dispatch({
                    type:'account/sendCode',
                    phone:phone
                })
            })
        }else{
            alert('请输入手机号码')
        }
    }
    _countDown = () => {
        return new Promise(resolve => {
            this.setState({
                can_send:false
            })
            if(this.state.can_send){
                this.setState({
                    seconds: this.state.seconds - 1,
                    send_text:'('+(this.state.seconds - 1)+')秒后发送'
                })
                this.send_id = setInterval(() => {
                    this.setState((preState) => ({
                        seconds: preState.seconds - 1,
                        send_text:'('+(preState.seconds - 1)+')秒后发送'
                    }), () => {
                        if (this.state.seconds <= 0) {
                            clearInterval(this.send_id);
                            this.setState({
                                send_text:'获取验证码',
                                seconds:60,
                                can_send:true
                            })
                        }
                    });
                }, 1000)
                resolve()
            }
        })
    }
    componentWillUnmount(){
        clearInterval(this.send_id)
    }
    validatePhone = (rule, value, callback) => {
        var phoneReg = /^((13[0-9])|(14[5-9])|(15([0-3]|[5-9]))|(16[6])|(17[1-8])|(18[0-9])|(19[8-9]))\d{8}$/;
        if (phoneReg.test(value)) {
            callback();
        }else{
            callback('手机号码有误!');
        }
    }
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('pwd')) {
            callback('两次密码不相同!');
        } else {
            callback();
        }
    }
    validatePassword = (rule, value, callback) => {
        var pwdReg = /^(\w){6,15}$/;
        if (pwdReg.test(value)) {
            callback();
        } else {
            callback('密码只能输入6-15个字母、数字、下划线!');
        }
    }
    render() {
        const {form} = this.props
        return (
            <>
            <Header
                title={'重置密码'}
            />
            <WhiteSpace size={'xl'}/>
            <div styleName="inputs">
                <InputItem
                    placeholder={'请输入手机号码'}
                    {...form.getFieldProps('phone', {
                        rules: [{
                            required: true, message: '请输入手机号',
                        }, {
                            validator: this.validatePhone,
                        }],
                    })}
                />
                <InputItem
                    placeholder={'请输入短信验证码'}
                    extra={<div styleName="send-code" onClick={this._sendCode}>{this.state.send_text}</div>}
                    {...form.getFieldProps('code', {
                        rules: [{
                            required: true, message: '请输入短信验证码',
                        }],
                    })}
                />
                <InputItem
                    placeholder={'请输入登录密码'}
                    type={'password'}
                    {...form.getFieldProps('pwd', {
                        rules: [{
                            required: true, message: '请输入登录密码',
                        }, {
                            validator: this.validatePassword,
                        }],
                    })}
                />
                <InputItem
                    placeholder={'请确认登录密码'}
                    type={'password'}
                    {...form.getFieldProps('secpwd', {
                        rules: [{
                            required: true, message: '请确认登录密码',
                        }, {
                            validator: this.validateToNextPassword,
                        }],
                    })}
                />
            </div>
            <div styleName="submit">
                <Button
                    type={'primary'}
                    onClick={this._submit}
                >下一步</Button>
            </div>
            </>
        )
    }
}
