import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from './styles/index.less'
import {Flex} from 'antd-mobile'
import Header from '@/components/header/'
import router from 'umi/router'
import Input from './components/input'
import History from './components/history'
import Results from './components/results'

@CSSModules(styles)

export default class extends PureComponent {
    render() {
        return (
            <>
                <Header
                    back={false}
                    title={'股票查询'}
                    rightText={<div onClick={() => router.goBack()}>取消</div>}
                />
                <Input/>
                <History/>
                <Results/>
            </>
        )
    }
}
