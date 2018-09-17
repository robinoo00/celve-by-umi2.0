import {PureComponent} from 'react'
import Header from './components/header'
import Switch from './components/switch'
import List from './components/list'
import Submit from './components/submit'

export default class extends PureComponent{
    render(){
        return(
            <>
                <Header/>
                <Switch/>
                <List/>
                <Submit/>
            </>
        )
    }
}
