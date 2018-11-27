import React from 'react'

export default class extends React.PureComponent{
    componentDidMount(){
        const id = 'k'
        this.画布 = document.getElementById(id)
        this.画布.width = window.screen.width * 1.5
        this.画布上下文 = this.画布.getContext("2d")
        this.画布上下文.fillStyle = '#11ff5a'
        this.画布上下文.fillRect(0, 0, this.画布.width, 400)
    }
    render(){
        return(
            <canvas
                id={'k'}
                style={{zoom:0.5}}
            ></canvas>
        )
    }
}
