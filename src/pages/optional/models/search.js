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
            const data = yield call(Search,{code:code})
            yield put({
                type:'assignResult',
                data:data
            })
            return data
        },
        * collect({code},{call,put}){
            const data = yield call(SelectedStockAdd,{code:code})
            if(data){
                alert(data.msg)
                return data.rs
            }
        }
    }
}
