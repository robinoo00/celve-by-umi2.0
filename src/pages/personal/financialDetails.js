import {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import styles from './styles/financialDetail.less'
import {List,ListView} from 'antd-mobile'
import Header from '@/components/header/'
import {CapitalFlow} from '@/services/api'
import Loading from '@/components/loading-nomore/'

const Item = List.Item

@CSSModules(styles)

export default class extends PureComponent {
    state = {
        list: [],
        data: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        nomore: false,
        page:0
    }
    componentDidMount(){
        this._getData(1)
    }
    _getData = (page) => {
        CapitalFlow({pgIndex:page,pageSize:10}).then(re => {
            let nomore = false
            let new_list = []
            const {list,data} = this.state
            const get_list= re.Orders
            if (list.length + get_list.length >= re.count){
                nomore = true
            }
            if(page === 1){
                new_list = get_list
            }else{
                new_list = list.concat(get_list)
            }
            this.setState({
                data:data.cloneWithRows(new_list),
                list: new_list,
                nomore: nomore,
                page: page
            })
        })
    }
    _loadMore = () => {
        const {nomore,page} = this.state
        if(!nomore){
            this._getData(this.state.page + 1)
        }
    }
    renderRow = (item) => {
        return (
            <Item
                extra={<div>{item.金额}</div>}
            >
                <div className={styles.title}>{item.类型}</div>
                <div className={styles.date}>{item.日期}</div>
            </Item>
        )
    }
    _getHeight = () => {
        const headerHeight = document.getElementById('header').clientHeight
        const hei = document.body.offsetHeight - headerHeight;
        return hei
    }
    render() {
        const {data,nomore,list,page} = this.state;
        if(list.length === 0) return <Header
            title={'资金明细'}
        />
        return (
            <div styleName="container">
            <Header
                title={'资金明细'}
            />
            <List>
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
                        height: this._getHeight() + 'px',
                        overflow: 'auto',
                    }}
                />
            </List>
            </div>
        )
    }
}
