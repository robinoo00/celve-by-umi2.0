import {TradeConfig, GetShares} from '@/services/api'
import {isTradeTime} from '@/utils/common'

export default {
    namespace: 'base',
    state: {
        config: null,
        canTrade: false,
        back: false,
    },
    subscriptions: {},
    reducers: {
        assignBack(state, {bool}) {
            return {
                ...state,
                back: bool
            }
        },
        assignConfig(state, {config}) {
            return {
                ...state,
                config: config
            }
        },
        assignCanTrade(state, {config}) {
            return {
                ...state,
                canTrade: isTradeTime(config)
            }
        }
    },
    effects: {
        * goBack(_, {put}) {
            console.log(1)
            yield put({
                type: 'assignBack',
                bool: true
            })
        },
        * getConfig(_, {put, call}) {
            try {
                const data = yield call(TradeConfig)
                if (data.rs) {
                    yield put({
                        type: 'assignConfig',
                        config: data.datas
                    })
                    yield put({
                        type: 'assignCanTrade',
                        config: data.datas
                    })
                }
            } catch (e) {
                console.log(e)
            }
        },
        * GetShares({code}, {call}) {
            try {
                const data = yield call(GetShares, {code: code})
                if (data) {
                    return data
                } else {
                    return null
                }
            } catch (e) {
                console.log(e)
            }
        }
    }
}
