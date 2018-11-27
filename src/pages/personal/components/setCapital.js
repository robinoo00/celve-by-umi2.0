import {PureComponent} from 'react'
import styles from '../styles/setLossGain.less'
import {Modal, InputItem,Flex} from 'antd-mobile'
import {createForm} from 'rc-form'
import {alert} from '@/utils/common'
import {connect} from 'dva'

@createForm()
@connect()

export default class extends PureComponent {
    _submit = () => {
        const {form} = this.props
        form.validateFields({force: true}, (error) => {
            if (!error) {
                let value = form.getFieldsValue();
                this._set(value)
            } else {
                const errors = Object.values(error);
                alert(errors[0]['errors'][0]['message']);
            }
        });
    }
    _set = (params) => {
        const {orderid,hide,dispatch,callback} = this.props
        dispatch({
            type:'personal/addCapital',
            orderid:orderid,
            capital:params.money
        }).then(data => {
            if(data){
                alert(data.msg)
                if(data.rs){
                    callback()
                    hide()
                }
            }
        })
    }
    _validate = (rule, value, callback) => {
        callback()
    }
    _hide = () => {
        const {hide} = this.props
        hide()
    }
    render() {
        const {form,visible} = this.props
        if(!visible) return null
        return (
            <Modal
                visible={visible}
                transparent
                maskClosable={true}
                onClose={this._hide}
                title="设置保证金"
                footer={[
                    {
                        text: '取消', onPress: this._hide
                    },
                    {
                        text: '确定', onPress: this._submit
                    }
                ]}
                wrapClassName={styles.wrap}
            >
                <InputItem
                    placeholder={'请输入保证金'}
                    type={'digit'}
                    moneyKeyboardAlign={'left'}
                    defaultValue={''}
                    {...form.getFieldProps('money',{
                        rules:[{
                            required:true,message:'请输入保证金'
                        }, {
                            validator: this._validate,
                        }]
                    })}
                />
            </Modal>
        )
    }
}
