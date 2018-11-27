import Footer from './footer'
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import styles from './index.less'
import {NoFooter} from '@/defaultSettings'
import {connect} from 'dva'
import React from 'react'

@connect(({base}) => ({
    back: base.back
}))


export default class extends React.PureComponent {
    componentWillReceiveProps(nextProps) {
        if (nextProps.back) {
            const {dispatch} = this.props
            setTimeout(() => {
                dispatch({
                    type: 'base/assignBack',
                    bool: false
                })
            },100)
        }
    }
    componentDidCatch(err, info) {
        console.log(err)
        console.log(info)
        console.log('err',err.toString())
        console.log('info',info.toString())
        // this.setState({ hasError: true })
        //sendErrorReport(err,info)
    }

    render() {
        const {back, location, children} = this.props
        const pathname = location.pathname
        return (
            <ReactCSSTransitionGroup
                transitionName={back ? "slide-out" : 'slide-in'}
                component="div"
                className={styles.silde}
                transitionEnterTimeout={300}
                transitionLeaveTimeout={300}
                transitionEnter={NoFooter.includes(pathname) || back}
                transitionLeave={NoFooter.includes(pathname) || back}
            >
                <div key={pathname}
                     style={{position: "absolute", width: "100%", height: '100%', backgroundColor: 'rgb(32, 33, 43)'}}
                >
                    {children}
                    <Footer/>
                </div>
            </ReactCSSTransitionGroup>
        )
    }
}
