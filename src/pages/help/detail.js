import {PureComponent} from 'react'
import {Flex} from 'antd-mobile'
import Header from '@/components/header/'
import {connect} from 'dva'
import {GetNewContent} from '@/services/api'

@connect(({help,routing}) => ({
    list:help.list,
    id:routing.location.query.id
}))

export default class extends PureComponent {
    state = {
        Text:null
    }
    Title = null
    componentDidMount(){
        const {list,id} = this.props
        const item = list.filter(item => item.id == id)[0]
        let con = item['con']
        this.Title = item.title
        if(!con){
            this._getData()
        }else{
            this.setState({
                Text:con,
            })
        }
    }
    _getData = () => {
        const {id} = this.props
        GetNewContent({id:id}).then(data => {
            this.setState({
                Text:data.data.Text
            })
        })
    }
    render() {
        const {Text} = this.state
        if(!Text) return <Header
            title={this.Title}
        />
        return (
            <div>
                <Header
                    title={this.Title}
                />
                <div style={{backgroundColor:'#e6e6e7',color:'#000',fontSize:'.4rem'}}>
                    <div dangerouslySetInnerHTML={{
                        __html: Text
                    }}></div>
                </div>
            </div>
        )
    }
}
