import {TradeDynamics} from '@/services/api'

export default {
    namespace: 'home',
    state: {

    },
    subscriptions: {},
    reducers: {},
    effects: {
        *getTradeDynamics(_,{call}){
            console.log(123)
            const data = yield call(TradeDynamics)
            return data
        }
    }
}
