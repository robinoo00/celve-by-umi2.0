import {RealName} from '@/services/api'
import {modal} from '@/utils/common'
import router from 'umi/router'

export default {
    namespace: 'certification',
    state: {
        name: '',
        idnum: '',
        address: '',
        IDFront: {
            src: null,
            file: null
        },
        IDBack: {
            src: null,
            file: null
        }
    },
    subscriptions: {},
    reducers: {
        assignID(state, {payload}) {//赋值身份证
            if(payload.type === 'front'){
                return {
                    ...state,
                    IDFront:{
                        ...state.IDFront,
                        src:payload.src,
                        file:payload.file
                    }
                }
            }
            if(payload.type === 'back'){
                return {
                    ...state,
                    IDBack:{
                        ...state.IDBack,
                        src:payload.src,
                        file:payload.file
                    }
                }
            }
        },
        assignData(state, {datas}) {
            return {
                ...state,
                ...datas
            }
        }
    },
    effects: {
        *submit({payload},{call}){
            let formData = new FormData();
            const keys = Object.keys(payload)
            for(let key of keys){
                if(key === 'pic1'){
                    formData.append('file',payload[key], "file_" + Date.parse(new Date()) + ".jpg")
                }
                if(key === 'pic2'){
                    formData.append('file',payload[key], "file_" + Date.parse(new Date()) + ".jpg")
                }
                if(key != 'pic1' && key != 'pic2'){
                    formData.append(key,payload[key])
                }
            }
            const data = yield call(RealName,formData)
            if(data){
                modal(data.msg,() => {
                    if(data.rs){
                        router.push('/personal')
                    }
                })
                return data
            }
        }
    }
}
