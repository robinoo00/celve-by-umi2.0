import {Tabs, WhiteSpace, Badge} from 'antd-mobile'
import CSSModules from 'react-css-modules'
import styles from '../styles/tabs.less'
import {PureComponent} from 'react'

const tabs = [
    {title: <Badge>交易动态</Badge>},
    {title: <Badge>盈利分配</Badge>},
];

@CSSModules(styles)

export default class extends PureComponent {
    render() {
        const {children} = this.props
        return (
            <div styleName="container">
                <Tabs tabs={tabs}
                      initialPage={1}
                      onChange={(tab, index) => {
                          console.log('onChange', index, tab);
                      }}
                      onTabClick={(tab, index) => {
                          console.log('onTabClick', index, tab);
                      }}
                      tabBarBackgroundColor={'#262834'}
                >
                    {children}
                </Tabs>
            </div>
        )
    }
}
