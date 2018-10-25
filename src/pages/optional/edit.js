import {PureComponent} from 'react'
import {Flex} from 'antd-mobile'
import Header from '@/components/header/'
import CSSModules from 'react-css-modules'
import styles from './styles/edit.less'
import {connect} from 'dva'
import {SelectedStockList} from '@/services/api'

@connect(({optional}) => ({
    list:optional.list
}))
@CSSModules(styles)

export default class extends PureComponent {
    state = {
        list:null
    }
    componentDidMount(){
        this._getData()
    }
    _getData = () => {
        SelectedStockList().then(data => {
            if(data.length > 0){
                for(let item of data){
                    item['choose'] = false
                }
            }
            this.setState({
                list:data
            })
        })
    }
    _choose = (code) => () => {
        let list = this.state.list
        for(let item of list){
            if(item.code === code){
                item['choose'] = !item['choose']
            }
        }
        this.setState({
            list:[...list]
        })
    }
    _remove = () => {
        const {dispatch} = this.props
        const {list} = this.state
        let codes = ''
        for(let item of list){
            if(item.choose){
                codes += item['code'] + ','
            }
        }
        codes = codes.substr(codes,codes.length - 1)
        dispatch({
            type: 'optional/remove',
            code:codes
        }).then(rs => {
            if(rs){
                this._getData()
            }
        })
    }
    _sort = (code) => () => {
        const {dispatch} = this.props
        dispatch({
            type:'optional/sort',
            code1:this.state.list[0]['code'],
            code2:code
        }).then(rs => {
            if(rs) this._getData()
        })
    }
    _renderItem = (item) => {
        return (
            <Flex styleName="item" key={item.code}>
                <Flex>
                    <div styleName={item.choose ? 'choose' : 'unchoose'} onClick={this._choose(item.code)}></div>
                    <div styleName="info">
                        <div>{item.name || '未获取到股票名'}</div>
                        <div>{item.code}</div>
                    </div>
                </Flex>
                <Flex.Item styleName='to-top' onClick={this._sort(item.code)}>

                </Flex.Item>
            </Flex>
        )
    }
    render() {
        const {list} = this.state
        if(!list) return null
        return (
            <>
                <Header
                    title={'我的自选'}
                    leftText={'完成'}
                    iconShow={false}
                    rightText={<div onClick={this._remove}>删除</div>}
                />
                <div styleName="container">
                    {list.map(item => this._renderItem(item))}
                </div>
            </>
        )
    }
}
