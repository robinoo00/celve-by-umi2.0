import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from './styles/register.less'
import {Flex,InputItem,WhiteSpace,Button} from 'antd-mobile'
import Header from '@/components/header/'
import {createForm} from 'rc-form'
import {connect} from 'dva'
import router from 'umi/router'
import {alert} from '@/utils/common'
import CountDown from '@/components/countDown/'

@createForm()
@connect()
@CSSModules(styles)

export default class extends PureComponent {
    state = {
        startCountDown:false,
        phone:null
    }
    _submit = () => {
        const {form, dispatch} = this.props
        form.validateFields({force: true}, (error) => {
            if (!error) {
                let value = form.getFieldsValue();
                dispatch({
                    type: 'account/submit',
                    payload: value,
                });
            } else {
                const errors = Object.values(error);
                alert(errors[0]['errors'][0]['message']);
            }
        });
    }
    _sendCode = () => {
        this.setState({
            startCountDown:!this.state.startCountDown,
            phone:this.props.form.getFieldValue('phone')
        })
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
        const {startCountDown,phone} = this.state
        return (
            <>
                <Header
                    title={'注册'}
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
                        // extra={<div styleName="send-code" onClick={this._sendCode}>{this.state.send_text}</div>}
                        extra={<div styleName="send-code" onClick={this._sendCode}>
                            <CountDown
                                connect={startCountDown}
                                phone={phone}
                            />
                        </div>}
                        {...form.getFieldProps('smscode', {
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
                    <InputItem
                        placeholder={'请确认邀请码'}
                        {...form.getFieldProps('referrer', {
                            rules: [{
                                required: true, message: '请确认邀请码',
                            }],
                        })}
                    />
                </div>
                <div styleName="submit">
                    <Button
                        type={'primary'}
                        onClick={this._submit}
                    >下一步</Button>
                    <p styleName="tip">
                        点击下一步，即同意<span>用户服务协议</span>
                    </p>
                </div>
                <div styleName="extra">
                    已有账户，去 <span onClick={() => {router.push('/account/login')}}>登录</span>
                </div>
            </>
        )
    }
}
