import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/info.less'
import {Flex,Button} from 'antd-mobile'
import BGIMG from '@/assets/personalBGIMG.jpg'
import person from '@/assets/person.png'
import {connect} from 'dva'
import router from 'umi/router'

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
                <img src={BGIMG} styleName="bg"/>
                <div styleName="mask"></div>
                <div styleName="service"></div>
                <div styleName="content">
                    <Flex styleName="detail">
                        <Flex.Item styleName="headimg">
                            <img src={person}/>
                        </Flex.Item>
                        <Flex.Item styleName="account">
                            <div styleName="nickname">{data.名字 || '路人'}</div>
                            <Flex styleName="money">
                                <Flex.Item styleName="money-item">
                                    <span>{data.余额}</span>
                                    <span>账号余额</span>
                                </Flex.Item>
                                {/*<Flex.Item styleName="money-item">*/}
                                    {/*<span>0</span>*/}
                                    {/*<span>抵用券</span>*/}
                                {/*</Flex.Item>*/}
                            </Flex>
                        </Flex.Item>
                    </Flex>
                    <Flex styleName="actions">
                        <Flex.Item>
                            <Button type={'primary'} onClick={() => {router.push('accountant/recharge')}}>充值</Button>
                        </Flex.Item>
                        <Flex.Item>
                            <Button onClick={() => {router.push('accountant/withdraw')}}>提现</Button>
                        </Flex.Item>
                    </Flex>
                </div>
            </div>
        )
    }
}
