import {PureComponent} from 'react'
import {Flex} from 'antd-mobile'
import {SendSmsCode,SendModifyCardCode} from '@/services/api'
import {alert} from '@/utils/common'
import {CID} from '@/utils/params'

export default class extends PureComponent {
    state = {
        seconds:5,
        connect:false,//连接使用 如果不相等 则为开
        send_text:'获取验证码'
    }
    can_send = true
    componentWillReceiveProps(nextProps){
        const {connect,phone} = nextProps
        const cid = localStorage.getItem(CID)
        if(cid){//已经登录 修改发送验证码
            if(this.state.connect != connect && this.can_send){
                this.setState({
                    connect:connect
                },() => {
                    this.phone = phone
                    this._countDown()
                        .then(this._sendModifyCode)
                })
            }
        }else{//注册发送验证码
            if(!phone){
                alert('请输入手机号码')
                return
            }
            if(this.state.connect != connect && this.can_send){
                this.setState({
                    connect:connect
                },() => {
                    this.phone = phone
                    this._countDown()
                        .then(this._sendCode)
                })
            }
        }
    }
    componentWillUnmount(){
        clearInterval(this.send_id)
    }
    _countDown = () => {
        return new Promise(resolve => {
            if(this.can_send){
                this.can_send = false
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
                            this.can_send = true
                            this.setState({
                                send_text:'获取验证码',
                                seconds:5,
                            })
                        }
                    });
                }, 1000)
                resolve()
            }
        })
    }
    _sendCode = () => {
        return new Promise(resolve => {
            const phone = this.phone
            SendSmsCode({phone:phone})
                .then(data => {
                    alert(data.msg)
                    resolve()
                })
        })
    }
    _sendModifyCode = () => {
        return new Promise(resolve => {
            SendModifyCardCode()
                .then(data => {
                    alert(data.msg)
                    resolve()
                })
        })
    }
    render() {
        const {send_text} = this.state
        return (
            <div>
                {send_text}
            </div>
        )
    }
}
