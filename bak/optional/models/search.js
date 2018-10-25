import {Search,SelectedStockAdd} from  '@/services/api'
import {alert} from "@/utils/common";

export default {
    namespace: 'search',
    state: {
        searching:false,
        searchResult:[]
    },
    subscriptions: {},
    reducers: {
        assignSearching(state,{bool}){
            return {
                ...state,
                searching:bool
            }
        },
        assignResult(state,{data}){
            return {
                ...state,
                searchResult:data
            }
        }
    },
    effects: {
        *search({code},{call,put}){
            if(!code){
                yield put({
                    type:'assignSearching',
                    bool:false
                })
                return
            }
            const data = yield call(Search,{code:code})
            yield put({
                type:'assignResult',
                data:data
            })
            yield put({
                type:'assignSearching',
                bool:true
            })
        },
        * collect({code},{call,put}){
            const data = yield call(SelectedStockAdd,{code:code})
            if(data){
                alert(data.msg)
                yield put({
                    type:'optional/getList'
                })
            }
        }
    }
}
