import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/header.less'
import {Flex} from 'antd-mobile'
import Header from '@/components/header/'
import router from 'umi/router'

@CSSModules(styles)

export default class extends PureComponent {
    render() {
        return (
            <Header
                iconShow={false}
                back={false}
                title={'我的自选'}
                leftText={<div onClick={() => {router.push('/optional/edit')}}>编辑</div>}
                rightText={<div styleName="search-icon" onClick={() => {router.push('/search')}}></div>}
            />
        )
    }
}
