export default {
    namespace: 'trade',
    state: {
        code:null
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({pathname,query}) => {
                if(pathname === '/trade'){
                    dispatch({
                        type:'assignCode',
                        code:query.code
                    })
                }
            })
        },
    },
    reducers: {
        assignCode(state,{code}){
            return {
                ...state,
                code:code
            }
        }
    },
    effects: {
        *getCode(_,{select,put}){
            let code = ''
            // code = yield select(state => state.trade.code)
            // if(code) return code
            yield put({
                type:'optional/getList'
            })
            const colList = yield select(state => state.optional.list)
            console.log(colList)
            // console.log(code)
        }
    }
}
