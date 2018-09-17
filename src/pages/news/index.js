import {PureComponent} from 'react'
import List from './components/list'
import Header from '@/components/header/'

export default class extends PureComponent {
    render() {
        return (
            <>
                <Header
                    back={false}
                    iconShow={false}
                    title={'新闻资讯'}
                />
                <List/>
            </>
        )
    }
}
