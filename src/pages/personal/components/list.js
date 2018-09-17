import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/list.less'
import {Flex, List, WhiteSpace} from 'antd-mobile'

const Item = List.Item
const list = [
    {style: 'strategy', title: '我的策略'},
    {style: 'money', title: '资金明细'},
    {style: 'promote', title: '推广赚钱'},
    {style: 'password', title: '登录密码'},
    {style: 'setting', title: '账户设置'},
]

@CSSModules(styles)

export default class extends PureComponent {
    render() {
        return (
            <div styleName="container">
                {list.map((item, index) => (
                    <>
                        {index == 0 ? <WhiteSpace size={'xl'}/> : null}
                        {index == 3 ? <WhiteSpace size={'xl'}/> : null}
                        <Item
                            arrow={'horizontal'}
                            styleName={item.style}
                        >
                            {item.title}
                        </Item>
                    </>
                ))}
            </div>
        )
    }
}
