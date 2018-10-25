import {PureComponent} from 'react'
import {Flex} from 'antd-mobile'
import Header from '@/components/header/'
import router from 'umi/router'
import Input from './components/search/input'
import History from './components/search/history'
import Results from './components/search/results'
import {connect} from 'dva'

@connect(({search}) => ({
    searching: search.searching
}))

export default class extends PureComponent {
    render() {
        const {searching} = this.props
        return (
            <>
            <Header
                back={true}
                title={'股票查询'}
                rightText={<div onClick={() => router.goBack()}>取消</div>}
            />
            <Input/>
            {searching ? <Results/> : <History/>}
            </>
        )
    }
}
