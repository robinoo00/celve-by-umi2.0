import {ActivityIndicator} from 'antd-mobile'
import styles from './style.less'
import {connect} from 'dva'
import {PureComponent} from 'react'

export default class extends PureComponent{
    render(){
        const {nomore = false,page = 1} = this.props
        return(
            <div>
                {!nomore ? <div style={{display:'flex',justifyContent:'center',marginTop:'10px'}}>
                        <ActivityIndicator color={"#fff"} text="正在加载..." />
                    </div> : null}
                {nomore && page!= 1 ? <div className={styles.nomore} style={{color:'#fff'}}>没有更多了</div> : null}
            </div>
        )
    }
}
