import {PureComponent} from 'react'
import Header from './components/header'
import Switch from './components/switch'
import List from '../home/components/dynamic-list'
import Submit from './components/submit'
import K from './components/k/'
import {connect} from 'dva'
import {TRADE_CODE} from '@/utils/params'

@connect(({routing}) => ({
    code:routing.location.query.code
}))

export default class extends PureComponent{
    state = {
        code:null
    }
    collectList = []
    componentDidMount(){
        this._getCollectList()
            .then(this._getCode)
            .then(this._saveCode)
            .then(code => {
                this.setState({
                    code:code
                })
            })
    }
    static getDerivedStateFromProps(props,state){
        if(props.code && props.code != state.code){
            return {
                code:props.code
            }
        }
        return null
    }
    _saveCode = (code) => {
        return new Promise(resolve => {
            localStorage.setItem(TRADE_CODE,code)
            resolve(code)
        })
    }
    /*
    * 1、从地址栏获取
    * 2、从localStorage获取即历史最新点击
    * 3、从收藏列表中第一个获取
    * 4、从搜索栏 'a'关键词列表第一个获取
    * */
    _getCode = () => {
        return new Promise(resolve => {
            const code = this.props.code
            if(code) resolve(code)
            else{
                this._getCodeByLocal()
                    .then(this._getCodeByCollect)
                    .then(this._getCodeBySearch)
                    .then(code => {
                        resolve(code)
                    })
            }
        })
    }
    _getCodeByLocal = () => {
        return new Promise(resolve => {
            const code = localStorage.getItem(TRADE_CODE)
            resolve(code)
        })
    }
    _getCodeByCollect = (code) => {
        return new Promise(resolve => {
            if(code) resolve(code)
            else{
                const list = this.collectList
                if(list.length > 0){
                    code = list[0]['code']
                }
                resolve(code)
            }
        })
    }
    _getCodeBySearch = (code) => {
        const {dispatch} = this.props

        return new Promise(resolve => {
            if(code) resolve(code)
            else{
                dispatch({
                    type:'search/search',
                    code:'a'
                }).then(data => {
                    if(data){
                        const code = data[0]['代码']
                        resolve(code)
                    }
                })
            }
        })
    }
    _getCollectList = () => {
        const {dispatch} = this.props
        return new Promise(resolve => {
            dispatch({
                type:'optional/getList'
            }).then(data => {
                if(data){
                    this.collectList = data
                    resolve()
                }
            })
        })
    }
    render(){
        const {code} = this.state
        if(!code) return null
        return(
            <>
                <Header/>
                <Switch code={code}/>
                <K code={code}/>
                <List/>
                <Submit code={code}/>
            </>
        )
    }
}
