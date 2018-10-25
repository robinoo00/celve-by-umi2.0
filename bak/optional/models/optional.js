import {SelectedStockList,SelectedStockDel,SelectedStockSort} from '@/services/api'
import {alert} from '@/utils/common'

export default {
    namespace: 'optional',
    state: {
        list:[],
        names:[]
    },
    subscriptions: {},
    reducers: {
        assignList(state,{data}){
            let names = []
            for(let item of data){
                names.push(item.name)
            }
            return {
                ...state,
                list:[...data],
                names:[...names]
            }
        }
    },
    effects: {
        *getList(_,{put,call}){
            const data = yield call(SelectedStockList)
            yield put({
                type:'assignList',
                data:data
            })
        },
        *remove({code},{call,put}){
            const data = yield call(SelectedStockDel,{code:code})
            if(data){
                alert(data.msg)
                yield put({
                    type:'getList'
                })
            }
        },
        *sort({code},{select,call,put}){
            const list = yield select(state => state.optional.list)
            const content = [
                {code:list[0]['code'],idx:1},
                {code:code,idx:0}
            ]
            const data = yield call(SelectedStockSort,{content:JSON.stringify(content)})
            alert(data.msg)
            if(data.rs){
                yield put({
                    type:'getList'
                })
            }
        }
    }
}
