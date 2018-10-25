import {SelectedStockList,SelectedStockDel,SelectedStockSort} from '@/services/api'
import {alert} from '@/utils/common'

export default {
    namespace: 'optional',
    state: {
        list:[],
        codes:[]
    },
    subscriptions: {},
    reducers: {
        assignList(state,{data}){
            let codes = []
            for(let item of data){
                codes.push(item.code)
            }
            return {
                ...state,
                list:[...data],
                codes:[...codes]
            }
        }
    },
    effects: {
        *getList(_,{put,call}){
            try{
                let data = yield call(SelectedStockList)
                if(data){
                    yield put({
                        type:'assignList',
                        data:data
                    })
                    return data
                }
            }catch(e){
                console.log(e)
            }
        },
        *remove({code},{call,put}){
            const data = yield call(SelectedStockDel,{code:code})
            if(data){
                alert(data.msg)
                return data.rs
            }
        },
        *sort({code1,code2},{select,call,put}){
            const content = [
                {code:code1,idx:1},
                {code:code2,idx:0}
            ]
            const data = yield call(SelectedStockSort,{content:JSON.stringify(content)})
            alert(data.msg)
            return data.rs
        }
    }
}
