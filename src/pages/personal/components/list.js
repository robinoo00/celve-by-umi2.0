import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/list.less'
import {Flex, List, WhiteSpace} from 'antd-mobile'
import router from 'umi/router'

const Item = List.Item
const list = [
    {style: 'strategy', title: '我的策略',url:'personal/myTrade'},
    {style: 'money', title: '结算单',url:'personal/myFinish'},
    {style: 'promote', title: '资金明细',url:'personal/financialDetails'},
    {style: 'password', title: '登录密码',url:'account/forget',extra:'修改'},
    {style: 'setting', title: '账户设置',url:'/settings'},
]

@CSSModules(styles)

export default class extends PureComponent {
    render() {
        return (
            <List styleName="container">
                {list.map((item, index) => (
                    <div key={index}>
                        {index == 0 ? <WhiteSpace size={'xl'}/> : null}
                        {index == 3 ? <WhiteSpace size={'xl'}/> : null}
                        <Item
                            arrow={'horizontal'}
                            styleName={item.style}
                            onClick={item.url ? () => {router.push(item.url)} : null}
                            extra={item.extra}
                        >
                            {item.title}
                        </Item>
                    </div>
                ))}
            </List>
        )
    }
}
