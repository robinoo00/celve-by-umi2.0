import {Login,SendForgotSmsCode,Register,ForgotPass} from '@/services/api'
import router from 'umi/router'
import Token from '@/utils/token'
import {alert} from "@/utils/common";

export default {
    namespace: 'account',
    state: {},
    subscriptions: {},
    reducers: {},
    effects: {
        *login({payload},{call}){
            const data = yield call(Login,payload)
            alert(data.msg)
            if(data.rs){
                Token.setCid(data.cid)
            }
            return data.rs
        },
        *sendCode({phone},{call}){
            const data = yield call(SendForgotSmsCode,{phone:phone})
            alert(data.msg)
        },
        *submit({payload},{call}){
            const data = yield call(Register,payload)
            alert(data.msg)
            if(data && data.rs){
                Token.setCid(data.data.cid)
                router.push('/personal')
            }
        },
        *forget({payload},{call}){
            const data = yield call(ForgotPass,payload)
            alert(data.msg)
            if(data && data.rs){
                router.goBack()
            }
        },
    }
}
