import {Userinfo,GetCloseOrderList} from '@/services/api'
import {alert} from '@/utils/common'
import router from 'umi/router'

export default {
    namespace: 'personal',
    state: {
        data:null,
        finishDetail:{}
    },
    subscriptions: {},
    reducers: {
        assignData(state,{data}){
            return {
                ...state,
                data:data
            }
        },
        assignFinishDetail(state,{data}){
            return {
                ...state,
                finishDetail:data
            }
        }
    },
    effects: {
        *getInfo(_,{call,put,select}){
            try{
                const data = yield call(Userinfo)
                if(data){
                    if(data.rs){
                        yield put({
                            type:'assignData',
                            data:data.datas
                        })
                    }else{
                        alert('账号过期，请重新登录')
                        router.push('/account/login')
                    }
                }
            }catch(e){
                console.log(e)
            }
        },
        *getCloseOrders(_,{call}){
            const data =  yield call(GetCloseOrderList)
            if(data && data.rs){
                return data.datas
            }
        }
    }
}
