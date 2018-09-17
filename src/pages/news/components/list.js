import CSSModules from 'react-css-modules'
import styles from '../styles/list.less'
import {PureComponent} from 'react'
import {ListView} from 'antd-mobile'
import {connect} from 'dva'
import Loading from '@/components/loading-nomore/'

@connect(({news}) => ({
    data: news.data,
    nomore: news.nomore,
    list: news.list,
    page: news.page
}))
@CSSModules(styles)

export default class extends PureComponent {
    componentDidMount(){
        const {dispatch} = this.props
        dispatch({
            type:'news/getList'
        })
    }
    renderRow(row) {
        return (
            <li>
                <div className={styles.timeline}>
                    <div className={styles.dotbg}>
                        <div className={styles.dot}></div>
                    </div>
                    <div className={styles.time}>{row.Time}</div>
                </div>
                <div className={styles.onlytxt}>
                    <div dangerouslySetInnerHTML={{
                        __html: row.Text
                    }}></div>
                </div>
            </li>
        )
    }

    _loadMore = () => {
        const {dispatch} = this.props
        dispatch({
            type:'mews/loadMore'
        })
    }

    render() {
        const {data,nomore,list,page} = this.props;
        if(list.length === 0) return null
        const headerHeight = document.getElementById('header').clientHeight
        const footerHeight = document.getElementById('footer').clientHeight
        const hei = document.body.offsetHeight - headerHeight - footerHeight;
        return (
            <div styleName="mod-news-wrap">
                <div styleName="timecon">
                    <ul styleName="livecon">
                        <ListView
                            dataSource={data}
                            renderRow={this.renderRow}
                            onEndReached={this._loadMore}
                            onEndReachedThreshold={50}
                            onScroll={() => {
                                console.log('scroll');
                            }}
                            scrollRenderAheadDistance={500}
                            renderFooter={() => <Loading nomore={nomore} page={page}/>}
                            // showsVerticalScrollIndicator={false}
                            style={{
                                height: hei + 'px',
                                overflow: 'auto',
                            }}
                        />
                    </ul>
                </div>
            </div>
        )
    }
}
