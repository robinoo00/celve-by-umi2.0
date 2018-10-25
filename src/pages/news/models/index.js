import {GetNews} from "@/services/api"
import {ListView} from 'antd-mobile'

export default {
    namespace: 'news',
    state: {
        list: [],
        data: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        nomore: false,
        page:0
    },
    subscriptions: {},
    reducers: {
        assignData(state, {data,page}) {
            let nomore = false
            let new_list = []
            if (state.list.length + data.datas.length >= data.count){
                nomore = true
            }
            if(page === 1){
                new_list = data.datas
            }else{
                new_list = state.list.concat(data.datas)
            }
            return {
                ...state,
                data:state.data.cloneWithRows(new_list),
                list: new_list,
                nomore: nomore,
                page: page
            }
        }
    },
    effects: {
        * getList({page = 1}, {call, put}) {
            const params = {
                type: '新闻',
                pgIndex: page,
                pgSize: 10
            }
            const data = yield call(GetNews, params)
            if (data) {
                yield put({
                    type: 'assignData',
                    data: data,
                    page: page
                })
            }
        },
        *loadMore(_,{select,put}){
            const page = yield select(state => state.news.page)
            const nomore = yield select(state => state.news.nomore)
            if(!nomore){
                yield put({
                    type:'getList',
                    page:page + 1
                })
            }
        }
    }
}
