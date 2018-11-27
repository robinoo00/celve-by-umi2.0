import {PureComponent} from 'react'
import styles from '../styles/setLossGain.less'
import {Modal, InputItem,Flex} from 'antd-mobile'
import {createForm} from 'rc-form'
import {alert} from '@/utils/common'
import {SetQuitGainLoss} from '@/services/api'

@createForm()

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
        const {finish,data} = this.props
        params.orderid = data.OrderID
        SetQuitGainLoss(params)
            .then(data => {
                finish(data)
            })
    }
    _validateGain = (rule, value, callback) => {
        callback()
    }
    _validateLoss = (rule, value, callback) => {
        callback()
    }
    _hide = () => {
        const {hide} = this.props
        hide()
    }
    change = val => {
        const {form} = this.props
        console.log(val)
    }
    render() {
        const {form,visible,data} = this.props
        if(!visible) return null
        return (
            <Modal
                visible={visible}
                transparent
                maskClosable={true}
                onClose={this._hide}
                title="设置止损止盈"
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
                <div>
                    <Flex className={styles.item}>
                        <span>止盈余额</span>
                        <InputItem
                            placeholder={'请输入止盈余额'}
                            {...form.getFieldProps('quitGain',{
                                initialValue:data.QuitGain,
                                rules:[{
                                    required:true,message:'请输入止盈余额'
                                }]
                            })}
                        />
                    </Flex>
                    <Flex className={styles.item}>
                        <span>止损余额</span>
                        <InputItem
                            placeholder={'请输入止损余额'}
                            {...form.getFieldProps('quitLoss',{
                                initialValue:data.QuitLoss,
                                onChange:this.change,
                                rules:[{
                                    required:true,message:'请输入止损余额'
                                }]
                            })}
                        />
                    </Flex>
                </div>
            </Modal>
        )
    }
}
