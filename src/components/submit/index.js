import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from './style.less'
import {Button} from 'antd-mobile'

@CSSModules(styles)

export default class extends PureComponent {
    render() {
        const {title,onClick} = this.props
        return (
            <div styleName="container">
                <Button
                    type={'primary'}
                    size={'large'}
                    onClick={onClick}
                >{title}</Button>
            </div>
        )
    }
}
