import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from './styles/login.less'
import {Flex,InputItem,Button,Checkbox,Toast} from 'antd-mobile'
import bg from '@/assets/loginBGC.png'
import logo from '@/assets/logo.png'
import {createForm} from 'rc-form'
import {connect} from 'dva'
import router from 'umi/router'
import {alert} from '@/utils/common'
import {ACCOUNT,PASSWORD} from '@/utils/params'

@createForm()
@connect()
@CSSModules(styles)

export default class extends PureComponent {
    _submit = () => {
        const {form, dispatch} = this.props
        form.validateFields({force: true}, (error) => {
            if (!error) {
                Toast.loading('登录中...',10)
                let value = form.getFieldsValue();
                dispatch({
                    type: 'account/login',
                    payload: {acc: value.account, pwd: value.password},
                }).then((rs) => {
                    if(rs){
                        Toast.hide()
                        localStorage.setItem(ACCOUNT,value.account)
                        localStorage.setItem(PASSWORD,value.password)
                        router.push('/personal')
                    }
                })
            } else {
                const errors = Object.values(error);
                alert(errors[0]['errors'][0]['message'], 1);
            }
        });
    }
    _close = () => {
        router.push('/')
    }

    render() {
        const {form} = this.props
        const account = localStorage.getItem(ACCOUNT)
        const pwd = localStorage.getItem(PASSWORD)
        return (
            <div styleName="container">
                <img styleName="bg" src={bg}/>
                <div styleName="mask"></div>
                {/*<div styleName="close" onClick={this._close}></div>*/}
                <div styleName="content">
                    <div styleName="logo">
                        <img src={logo} alt=""/>
                    </div>
                    <div styleName="inputs">
                        <InputItem
                            placeholder={'手机号'}
                            clear={true}
                            {...form.getFieldProps('account', {
                                initialValue:account || null,
                                rules: [{
                                    required: true, message: '请输入手机号',
                                }],
                            })}
                        />
                        <InputItem
                            placeholder={'密码'}
                            type={'password'}
                            clear={true}
                            extra={<span onClick={() => {router.push('/account/forget')}}>忘记密码？</span>}
                            {...form.getFieldProps('password', {
                                initialValue:pwd || null,
                                rules: [{
                                    required: true, message: '请输入密码',
                                }],
                            })}
                        />
                        {/*<Checkbox.AgreeItem>记住密码</Checkbox.AgreeItem>*/}
                    </div>
                    <div styleName="submit">
                        <Button type={'primary'} onClick={this._submit}>登录</Button>
                    </div>
                    <Flex styleName="extra">
                        <Flex.Item>联系客服</Flex.Item>
                        <Flex.Item onClick={() => {router.push('/account/register')}}>免费注册</Flex.Item>
                    </Flex>
                </div>
            </div>
        )
    }
}
