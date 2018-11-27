import {PureComponent} from 'react'
import Header from '@/components/header/'
import {GetNewContent} from '@/services/api'

export default class extends PureComponent {
    state = {
        text:null
    }
    componentDidMount(){
        this._getData()
    }
    _getData = () => {
        GetNewContent({id:1187})
            .then(data => {
                this.setState({
                    text:data.data.Text
                })
            })
    }
    render() {
        const {text} = this.state
        if(!text) return null
        return (
            <div>
                <Header
                    title={'规则'}
                />
                <div style={{backgroundColor:'#fff',padding:'.3rem'}}>
                    <div dangerouslySetInnerHTML={{
                        __html: text
                    }}></div>
                </div>
            </div>
        )
    }
}
