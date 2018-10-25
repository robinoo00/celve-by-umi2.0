import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/search.less'
import {Flex,InputItem} from 'antd-mobile'
import personIcon from '@/assets/person.png'
import router from 'umi/router'
import {connect} from 'dva'

@connect(({personal}) => ({
    data:personal.data
}))
@CSSModules(styles)

export default class extends PureComponent {
    componentDidMount(){
        const {dispatch} = this.props
        dispatch({
            type:'personal/getInfo'
        })
    }
    render() {
        const {data} = this.props
        if(!data) return null
        return (
            <div styleName="container">
                <Flex>
                    <Flex styleName="personal-info" onClick={() => {router.push('/personal')}}>
                        <img styleName="icon" src={personIcon} alt=""/>
                        <div styleName="detail">
                            <div>{data.名字 || '路人'}</div>
                            <div>({data.状态})</div>
                        </div>
                    </Flex>
                    <Flex.Item styleName="input" onClick={() => {router.push('/optional/search')}}
                    >
                        <InputItem
                            disabled={true}
                            placeholder={'请输入股票名称/代码/简称'}
                        />
                    </Flex.Item>
                    <Flex.Item styleName="help" onClick={() => {router.push('help')}}></Flex.Item>
                </Flex>
            </div>
        )
    }
}
