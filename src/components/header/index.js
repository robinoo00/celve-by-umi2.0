import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from './style.less'
import {Flex} from 'antd-mobile'
import router from 'umi/router'

@CSSModules(styles)

export default class extends PureComponent {
    render() {
        let {back=true,iconShow=true,title, leftText,rightText} = this.props
        let leftCallBack = () => {}
        if(back) leftCallBack = () => {router.goBack()}
        return (
            <div styleName="wrap">
                <Flex styleName="container" data-type="section" id="header">
                    <Flex styleName="back" onClick={leftCallBack}>
                        {iconShow ? <div styleName="icon"></div> : null}
                        <div styleName="backText">{leftText}</div>
                    </Flex>
                    <Flex.Item styleName="title">{title}</Flex.Item>
                    <Flex.Item styleName="extra">{rightText}</Flex.Item>
                </Flex>
            </div>
        )
    }
}
