import Search from './components/search'
import {PureComponent } from 'react'
import Banner from './components/banner'
import Exponent from './components/exponent'
import Nav from './components/nav'
import Tabs from './components/tabs'
import Dynamic from './components/dynamic-list'
import Allocation from './components/allocation-list'

export default class extends PureComponent{
    render(){
        return(
            <>
                <Search/>
                <Banner/>
                <Exponent/>
                <Nav/>
                <Tabs>
                    <Dynamic/>
                    <Allocation/>
                </Tabs>
            </>
        )
    }
}
