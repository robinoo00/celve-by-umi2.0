import {PureComponent} from 'react'
import styles from './/styles/recharge.less'
import {List} from 'antd-mobile'
import icon from './images/alipay.png'
import Header from '@/components/header/'
import {port} from '@/defaultSettings'
import {CID} from '@/utils/params'

const Item = List.Item;
const Brief = Item.Brief;

export default class extends PureComponent {
    _link = () => {
        const cid = localStorage.getItem(CID)
        const url = `${port}pay/niubipay?cid=${cid}`
        window.location.href = url
    }
    render() {
        return (
            <div className={styles.container}>
                <Header
                    title={'账户充值'}
                />
                <Item
                    onClick={this._link}
                    multipleLine
                    arrow={"horizontal"}
                    thumb={<img src={icon} style={{width: '1.9rem', height: '0.9rem'}}/>}
                >
                    <div className={styles.title}>支付宝</div>
                    <Brief>手机支付，免手续费</Brief>
                </Item>
            </div>
        )
    }
}
