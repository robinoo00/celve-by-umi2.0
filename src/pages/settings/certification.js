import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from './styles/certification.less'
import {Flex, InputItem} from 'antd-mobile'
import Header from '@/components/header/'
import {connect} from 'dva'
import {createForm} from 'rc-form'
import Submit from '@/components/submit/'
import front from '@/assets/IDCardFront.png'
import back from '@/assets/IDCardBack.png'
import {alert} from '@/utils/common'
import router from 'umi/router'

@createForm()
@connect(({certification}) => ({
    IDFront:certification.IDFront,
    IDBack:certification.IDBack
}))
@CSSModules(styles)

export default class extends PureComponent {
    _submit = () => {
        const {form, dispatch} = this.props
        form.validateFields({force: true}, (error) => {
            if (!error) {
                let value = form.getFieldsValue();
                dispatch({
                    type: 'certification/assignData',
                    datas: value,
                });
                if(this._checkImg()){
                    router.push('/settings/bank')
                }
            } else {
                const errors = Object.values(error);
                alert(errors[0]['errors'][0]['message']);
            }
        });
    }
    _pickImg = (type) => (e) => {
        const {dispatch} = this.props
        const file = e.target.files[0];
        dispatch({
            type:'certification/assignID',
            payload:{
                file:file,
                src:window.URL.createObjectURL(file),
                type:type
            }
        })
    }
    _checkImg = () => {
        const {IDFront,IDBack} = this.props
        if(!IDFront.src){
            alert('请上传身份证正面照')
            return false
        }
        if(!IDBack.src){
            alert('请上传身份证背面照')
            return false
        }
        return true
    }
    _renderInputs = () => {
        const {form} = this.props
        return (
            <div styleName="inputs">
                <InputItem
                    placeholder={'请输入真实姓名'}
                    clear={true}
                    {...form.getFieldProps('name', {
                        rules: [{
                            required: true,
                            message: '请输入真实姓名'
                        }]
                    })}
                >
                    真实姓名
                </InputItem>
                <InputItem
                    placeholder={'请输入身份证号'}
                    clear={true}
                    {...form.getFieldProps('idnum', {
                        rules: [{
                            required: true,
                            message: '请输入身份证号'
                        }]
                    })}
                >
                    身份证号
                </InputItem>
                <InputItem
                    placeholder={'请输入住址'}
                    clear={true}
                    {...form.getFieldProps('address', {
                        rules: [{
                            required: true,
                            message: '请输入住址'
                        }]
                    })}
                >
                    现住地址
                </InputItem>
            </div>
        )
    }
    _renderImgItems = () => {
        const {IDFront,IDBack} = this.props
        return (
            <Flex styleName="imgs-container">
                <Flex.Item styleName="item">
                    <input type="file" styleName="file" onChange={this._pickImg('front')}/>
                    <div styleName="icon">
                        <img src={IDFront.src || front} alt=""/>
                    </div>
                    <div styleName="btn">
                        身份证正面照
                    </div>
                </Flex.Item>
                <Flex.Item styleName="item">
                    <input type="file" styleName="file" onChange={this._pickImg('back')}/>
                    <div styleName="icon">
                        <img src={IDBack.src || back} alt=""/>
                    </div>
                    <div styleName="btn">
                        身份证背面照
                    </div>
                </Flex.Item>
            </Flex>
        )
    }
    render() {
        return (
            <>
            <Header
                title={'实名认证'}
            />
            <div styleName="tip1">
                为了保障您的账户安全，请先进行实名认证
            </div>
            {this._renderInputs()}
            {this._renderImgItems()}
            <div styleName="tip2">
                为防止盗刷卡，根据银监会、央行规定，请您输入您的真实信息，给您带来的不便，尽情谅解.
            </div>
            <Submit
                onClick={this._submit}
                title={'下一步'}
            />
            </>
        )
    }
}
