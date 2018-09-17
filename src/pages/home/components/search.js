import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/search.less'
import {Flex,InputItem} from 'antd-mobile'
import personIcon from '@/assets/person.png'
import router from 'umi/router'

@CSSModules(styles)

export default class extends PureComponent {
    render() {
        return (
            <div styleName="container">
                <Flex>
                    <Flex styleName="personal-info">
                        <img styleName="icon" src={personIcon} alt=""/>
                        <div styleName="detail">
                            <div>简单o0</div>
                            <div>(非会员)</div>
                        </div>
                    </Flex>
                    <Flex.Item styleName="input">
                        <InputItem
                            placeholder={'请输入股票名称/代码/简称'}
                            onClick={() => {router.push('/search')}}
                        />
                    </Flex.Item>
                    <Flex.Item styleName="help"></Flex.Item>
                </Flex>
            </div>
        )
    }
}
