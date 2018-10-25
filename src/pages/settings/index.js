import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from './styles/index.less'
import {Flex} from 'antd-mobile'
import Header from '@/components/header/'
import {List, Button} from 'antd-mobile'
import router from 'umi/router'
import {connect} from 'dva'
import {Userinfo} from '@/services/api'
import Submit from '@/components/submit/'
import Token from '@/utils/token'
import {modal} from '@/utils/common'

const Item = List.Item

@connect(({personal}) => ({
    data:personal.data
}))
@CSSModules(styles)

export default class extends PureComponent {
    state = {
        list:[
            {title: '用户名', extra: '', key: '名字', arrow: 'empty', url: null},
            {title: '实名认证', extra: '', key: '身份证', arrow: 'horizontal', url: '/settings/certification'},
            {title: '银行卡', extra: '', key: '银行', arrow: 'horizontal', url: 'accountant/bankcard'},
            {title: '手机绑定', extra: '', key: '账号', arrow: 'empty', url: null},
        ]
    }
    componentDidMount(){
        const {data,dispatch} = this.props
        this._assignList(data)
        // if(Object.keys(data).length === 0){
        //     Userinfo().then(data => {
        //         if(data.rs){
        //             const datas = data.datas
        //
        //         }
        //     })
        // }
    }
    _assignList = (datas) => {
        let list = this.state.list
        for(let item of list){
            item['extra'] = datas[item['key']]
            if(item['key'] === '身份证'){
                console.log(123)
                if(!datas[item['key']]){
                    item['extra'] = datas['状态']
                }
            }
        }
        this.setState({
            list:[...list]
        })
    }
    _loginOut = () => {
        Token.clearCid()
        router.push('/account/login')
    }
    _link = (item) => () => {
        if(item.key === '身份证'){
            if(item.extra === '审核中'){
                modal('审核中，请耐心等待');
                return
            }else{
                modal('已认证');
                return
            }
        }
        router.push(item.url)
    }
    render() {
        const {list} = this.state
        console.log(list)
        return (
            <>
            <Header
                title={'账户设置'}
            />
            <List styleName={'list'}>
                {list.map(item => (
                    <Item
                        key={item.key}
                        extra={item.extra}
                        arrow={item.arrow}
                        onClick={item.url ? this._link(item) : null}
                    >{item.title}</Item>
                ))}
            </List>
            <Submit
                title={'退出登录'}
                onClick={this._loginOut}
            />
            </>
        )
    }
}
