import {Search,SelectedStockAdd} from  '@/services/api'

export default {
    namespace: 'tess',
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
            yield put({
                type:'assignSearching',
                bool:true
            })
        },
        * add({code},{call}){
            console.log(code)
            const data = yield call(SelectedStockAdd,{code:code})
            console.log(data)
        }
    }
}
