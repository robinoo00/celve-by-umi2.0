import {PureComponent} from 'react'
import {connect} from 'dva'
import router from 'umi/router'
import {reBuildCode} from '@/utils/common'
import Comp from './dynamic-list-comp'

@connect()

export default class extends PureComponent {
    state = {
        list:null
    }
    componentDidMount(){
        console.log(123)
        const {dispatch} = this.props
        dispatch({
            type:'home/getTradeDynamics'
        }).then(list => {
            if(list){
                this.setState({
                    list:list
                })
            }
        })
    }
    _link = (code) => () => {
        code = reBuildCode(code)
        router.push({pathname:'trade',query:{code:code}})
    }
    render() {
        const {list} = this.state
        if(!list) return null
        return (
            <Comp
                list={list}
                link={code => this._link(code)}
            />
        )
    }
}
