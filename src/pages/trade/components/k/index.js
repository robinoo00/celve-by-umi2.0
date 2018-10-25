import React from 'react'
import Draw from './draw'
import CSSModules from 'react-css-modules'
import styles from './k.css'
import {Flex} from 'antd-mobile'
import {getKData} from '@/services/api'
import {connect} from 'dva'
import {TRADE_CODE} from '@/utils/params'
import Pan from './pan'

const draw = new Draw();

class K extends React.Component {
    state = {
        type_list:['分时','日线','周线','月线','盘口'],
        type_choose:'分时',
        reload:false,
        pan:false
    }
    // code = this.props.code ? this.props.code : localStorage.getItem(TRADE_CODE)
    // code = this.props.code
    code = this.props.code
    sid = 0
    lastTime = ''
    type_choose = '分时'
    height = (274 / 667) * window.screen.height
    componentDidMount() {
        const kOffetTop = document.getElementById("k").offsetTop - 10
        // this.height = window.screen.height - kOffetTop -100
        setTimeout(() => {
            draw.画布id = "k";
            draw.宽 = window.screen.width;
            // draw.高 = window.screen.height - 327;
            draw.高 = this.height;
            draw.上边距 = 0;
            draw.距顶距离 = kOffetTop * 2;
            draw.定时 = 300;
            draw.init();
            draw.loading();
            draw.reload();
            draw.eve();
        })
        setTimeout(() => {
            this._getData()
            this.sid = setInterval(this._getData,1000)
        })
    }
    _getData = () => {
        const params = {
            contract: this.code,
            type:this.type_choose,
            time:this.lastTime
        }
        getKData(params).then(data => {
            if(data){
                if(this.state.reload && data.length < 4){
                    return
                }else{
                    this.setState({
                        reload:false
                    })
                    let time = ''
                    if(data.length === 1){
                        time = data[0]['结束时间']
                    }
                    if(data.length != 0 && data.length != 1){
                        time = data[data.length - 1]['结束时间']
                    }
                    this.lastTime = time
                    this.draw(data)
                }
            }
        })
    }
    componentWillUnmount(){
        draw.reload();
        draw.loading();
        clearInterval(this.sid)
    }
    draw(data) {
        const len = data.length;
        if (len != 0) {
            draw.代码 = this.code;
            draw.类型 = this.state.type_choose;
            draw.getdata(data);
        }
    }

    chooseType = type => () => {
        if(type === '盘口'){
            this.setState({
                type_choose:type,
                reload:true,
                pan:true
            })
        }else{
            this.setState({
                pan:false
            })
            draw.reload();
            this.lastTime = ''
            this.type_choose = type
            if (this.state.type_choose != type) {
                draw.loading();
                this.setState({
                    type_choose:type,
                    reload:true
                })
                this._getData(type)
                if(type != '分时'){
                    clearInterval(this.sid)
                }else{
                    this.sid = setInterval(this._getData,1000)
                }
            }
        }
    }

    render() {
        const {type_list,type_choose,pan} = this.state;
        return (
            <div>
                <Flex className={styles["k-nav"]}>
                    {type_list.map((item,index) => (
                        <Flex.Item style={type_choose === item ? {borderBottom:'1px solid #fff'} : {}} className={styles["k-nav-item"]} key={'k_nav_'+index} onClick={this.chooseType(item).bind(this)}>{item}</Flex.Item>
                    ))}
                </Flex>
                <div style={{height:this.height * 2 + 'px'}}>
                    <canvas id="k" style={{zoom: 1, backgroundColor: "#20212b"}} style={pan ? {display:'none'} : null}></canvas>
                    {pan ? <Pan
                        height={this.height}
                    /> : null}
                </div>
            </div>
        )
    }
}


export default CSSModules(K,styles)
