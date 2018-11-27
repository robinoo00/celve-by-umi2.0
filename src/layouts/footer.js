import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from './footer.less'
import {Flex} from 'antd-mobile'
import {connect} from 'dva'
import {NoFooter} from '@/defaultSettings'
import router from 'umi/router'

@connect(({routing}) => ({
    pathname:routing.location.pathname
}))
@CSSModules(styles)

export default class extends PureComponent {
    render() {
        const {pathname} = this.props
        if(NoFooter.includes(pathname)){
            return null
        }
        const list = [
            {title:'首页',url:'/home'},
            {title:'策略',url:'/trade'},
            {title:'资讯',url:'/news'},
            {title:'自选',url:'/optional'},
            {title:'我的',url:'/personal'}
        ]
        return (
            <div styleName="wrap">
                <Flex styleName="container"  id="footer" data-type="section">
                    {list.map(item => (
                        <Flex.Item
                            key={item.title}
                            styleName="item" data-color={pathname === item.url ? "orange" : null}
                            onClick={() => {router.push(item.url)}}
                        >
                            <div styleName="icon"></div>
                            <div styleName="title">{item.title}</div>
                        </Flex.Item>
                    ))}
                </Flex>
            </div>
        )
    }
}
