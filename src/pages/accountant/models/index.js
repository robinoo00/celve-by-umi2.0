import {withdraw} from '@/services/api'

export default {
    namespace: 'accountant',
    state: {},
    subscriptions: {},
    reducers: {},
    effects: {
        *withdraw({money},{call}){
            const data = yield call(withdraw,{money:money})
            return data
        }
    }
}
