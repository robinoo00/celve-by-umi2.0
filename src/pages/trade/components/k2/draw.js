import Base from './base'

export default class extends Base {
    constructor(id) {
        super(id)
    }
    /*初始化加载*/
    init() {
        this.开始条数 = this.data.length-this.K线显示柱条数
        this.结束条数 = this.data.length
        this.单位宽度 = this.画布.width / this.K线显示柱条数
        this.距顶距离 = document.getElementById('kcanvas').offsetTop
        console.log(this.距顶距离)
    }
    loading() {
        this.画布上下文.clearRect(0, 0, this.画布.width, this.画布.height);
        this.画布上下文.font = "19px sans-serif";
        this.画布上下文.fillStyle = '#aaa';
        this.画布上下文.fillText("数据加载中..", (this.画布.width / 2) - 50, (this.画布.height / 2) - 10);
    }
    /*赋值原始数据*/
    assignData(data){
        if(this.data.length === 0){
            this.data = data
            this.init()
        }else{
            this.jointData(data)
        }
        this.initMACDData()
        this.draw()
    }
    /*拼接数据this.data*/
    jointData(data){
        if(data.length === 1){
            if(data[0]['现价'] != 0 ) this.data[this.data.length - 1]['收盘'] = data[0]['现价']
        }else{
            let diff = 0
            for(let i = 0; i < data.length; i ++){//获取到的数据有重复性
                let lastTime = this.data[this.data.length - 1]['结束时间']
                lastTime = Date.parse(new Date(lastTime))
                let getTime = data[i]['结束时间']
                getTime = Date.parse(new Date(getTime))
                if(getTime > lastTime){
                    diff ++
                    this.data.push(data)
                }
            }
            console.log('插入数据',data)
            this.开始条数 += diff
            this.结束条数 += diff
        }
    }
    //选择类型
    chooseType(value) {
        this.类型 = value
    }

    /*开始绘制*/
    draw() {
        this.画布上下文.clearRect(0, 0, this.画布.width, this.画布.height);
        this.新数组 = this.getDrawArr()
        this.initData()
        this._drawLeftText()
        this._drawTime()
        this.assignMData() //赋值M5 M10 M15
        if (this.类型 === '分时') {
            this._drawFenshiK()
        } else {
            this._drawNotFenshiK() //非分时的数据
            this._drawKBarGraph() //K线柱图
        }
        this._drawMACD() //绘制中间部分
        this._drawLiang() //绘制量区
    }
    /*绘制按住拖动*/
    drawDrag(x,y){
        this.画布上下文.clearRect(0, 0, this.画布.width, this.画布.height);
        this.draw()
        if(this.十字线显示){
            this._drawCross(x,y)
            this._drawDetail(x,y)
        }
    }
    /*绘制十字线*/
    _drawCross(x,y){
        console.log('y',y)
        console.log('距顶距离',this.距顶距离)
        this.画布上下文.font = "15px sans-serif";
        this.画布上下文.beginPath();
        this.画布上下文.strokeStyle = '#c3c3c3';
        this.画布上下文.moveTo(0, (y - this.距顶距离) / 1.5);
        this.画布上下文.lineTo(this.画布.width, (y - this.距顶距离) / 1.5);
        this.画布上下文.moveTo(x / 1.5, 0);
        this.画布上下文.lineTo(x / 1.5, this.画布.height);
        this.画布上下文.stroke();
        this.画布上下文.restore();
    }
    /*绘制左上角详情框*/
    _drawDetail(x,y){
        this.画布上下文.save();
        this.画布上下文.fillStyle = "#000";
        this.画布上下文.globalAlpha = 0.7;
        this.画布上下文.fillRect(0, 0, 200, 440);
        this.画布上下文.stroke();
        this.画布上下文.font = "18px sans-serif";
        this.画布上下文.fillStyle = '#fff'
        const diff = this.getCrowwDiff()
        const 数据索引 = Math.floor(x / diff)
        // console.log(this.M5)
        this.画布上下文.fillText("开: " + this.新数组.length <= 0 || 数据索引 >= this.新数组.length ? "-" : "开: " + this.新数组[数据索引].开仓,10,  30);
        this.画布上下文.fillText("高: " + this.新数组.length <= 0 || 数据索引 >= this.新数组.length ? "-" : "高: " + this.新数组[数据索引].最高, 10, 60);
        this.画布上下文.fillText("低: " + this.新数组.length <= 0 || 数据索引 >= this.新数组.length ? "-" : "低: " + this.新数组[数据索引].最低, 10,90);
        this.画布上下文.fillText("收: " + this.新数组.length <= 0 || 数据索引 >= this.新数组.length ? "-" : "收: " + this.新数组[数据索引].最低,10,120);
        this.画布上下文.fillText("量: " + this.新数组.length <= 0 || 数据索引 >= this.新数组.length ? "-" : "量: " + this.新数组[数据索引].量, 10, 150);
        this.画布上下文.fillStyle = this.M5颜色;
        this.画布上下文.fillText("M5: " + this.M5.length <= 0 || 数据索引 >= this.M5.length ? "-" : "M5: " + Number(this.M5[数据索引]).toFixed(2), 10, 180);
        this.画布上下文.fillStyle = this.M10颜色;
        this.画布上下文.fillText("M10: " + this.M10.length <= 0 || 数据索引 >= this.M10.length ? "-" : "M10: " + Number(this.M10[数据索引]).toFixed(2), 10, 210);
        this.画布上下文.fillStyle = this.M15颜色;
        this.画布上下文.fillText("M15: " + this.M15.length <= 0 || 数据索引 >= this.M15.length ? "-" : "M15: " + Number(this.M15[数据索引]).toFixed(2), 10, 240);
        this.画布上下文.fillStyle = this.DIFF颜色;
        this.画布上下文.fillText("DIFF: " + this.新MACD.length <= 0 || 数据索引 >= this.新MACD.length ? "-" : "DIFF: " + Number(this.新MACD[数据索引].DIFF).toFixed(2), 10, 270);
        this.画布上下文.fillStyle = this.DEA颜色;
        this.画布上下文.fillText("DEA: " + this.新MACD.length <= 0 || 数据索引 >= this.新MACD.length ? "-" : "DEA: " + Number(this.新MACD[数据索引].DEA).toFixed(2), 10, 300);
        this.画布上下文.fillStyle = this.BAR颜色;
        this.画布上下文.fillText("BAR: " + this.新MACD.length <= 0 || 数据索引 >= this.新MACD.length ? "-" : "BAR: " + Number(this.新MACD[数据索引].BAR).toFixed(2), 10, 330);
        this.画布上下文.fillStyle = this.显示文本颜色;
        this.画布上下文.fillText("时: " + this.新数组.length <= 0 || 数据索引 >= this.新数组.length ? "-" : "时: " + this.handleTimeFormat(this.新数组[数据索引].结束时间), 10, 360);
        this.画布上下文.restore();
    }

    _test() {
        // this.画布上下文.fillStyle = '#11ff5a'
        // this.画布上下文.fillRect(0, 0, this.画布.width, this.K线区高度)
    }

    /*绘制MACD区*/
    _drawMACD() {
        this.macd计算 = this.MACDlen()
        const data = this.新MACD
        let DIFFs = []
        let DEAs = []
        data.forEach((v, i) => {
            DIFFs.push(v['DIFF'])
            DEAs.push(v['DEA'])
            //绘制柱图
            let color = v.BAR >= 0 ? this.K柱阳颜色 : this.K柱阴颜色
            const diff = this.getCrowwDiff()
            let draw_bar = {
                x: diff * i,
                y: v.BAR > 0 ? this.getMACCoordByBarValue(Math.abs(v.BAR)) : this.K线区高度 + this.MACD区高度 / 2,
                height: Math.abs(v.BAR / this.macd计算.BAR最大值) * this.MACD区高度 / 2
            }
            this._drawBar(draw_bar,color)
        })
        //绘制线
        const DIFFs_line = this.getMACCoord(DIFFs)
        const DEAs_line = this.getMACCoord(DEAs)
        this._drawLine(DIFFs_line, '#fff')
        this._drawLine(DEAs_line, '#ffd800')
    }
    /*
    * 绘制量区
    * */
    _drawLiang(){
        const data = this.新数组
        const diff = this.getCrowwDiff()
        data.forEach((v,i) => {
            const bar_data = {
                x: diff * i,
                y: this.getLiangCoordByValue(v.量),
                height: this.getLiangBarHeight(v.量)
            }
            const color = v.开仓 >= v.收盘 ? this.K柱阴颜色 : this.K柱阳颜色
            this._drawBar(bar_data,color)
        })
    }

    //绘制非分时 K线
    _drawNotFenshiK() {
        const draw_arr1 = this.getKCoord(this.M5)
        this._drawLine(draw_arr1, "#b2ff94")
        const draw_arr2 = this.getKCoord(this.M10)
        this._drawLine(draw_arr2, "#94e2ff")
        const draw_arr3 = this.getKCoord(this.M15)
        this._drawLine(draw_arr3, "#ffe594")
    }

    /*绘制K线柱图*/
    _drawKBarGraph() {
        const diff = this.getCrowwDiff()
        this.新数组.forEach((item, i) => {
            const bar_height = this.getKHeightByDiff(item.开仓, item.收盘)
            const bar_data = {
                x: diff * i,
                y: this.getYCoordByValue(Math.max(item.开仓, item.收盘)),
                height: bar_height > 0 ? bar_height : 0.5
            }
            const color = item.开仓 >= item.收盘 ? this.K柱阴颜色 : this.K柱阳颜色
            //绘制柱图
            this._drawBar(bar_data,color)
            //绘制中心线
            const line_data = {
                startX: bar_data.x + Math.floor(this.k线柱宽度 / 2) + 0.5,
                startY: this.getYCoordByValue(item.最高),
            }
            const line_height = this.getKHeightByDiff(item.最高, item.最低)
            this.画布上下文.strokeStyle = color;
            this.画布上下文.moveTo(line_data.startX, line_data.startY);
            this.画布上下文.lineTo(line_data.startX, line_data.startY + line_height);
            this.画布上下文.stroke();
        })
    }

    //绘制分时 K 线
    _drawFenshiK() {
        const draw_arr1 = this.getKCoord(this.收盘价)
        this._drawLine(draw_arr1)

        const arr2 = this.getJunArr()
        const draw_arr2 = this.getKCoord(arr2)
        this._drawLine(draw_arr2, "#ff5400")
    }

    //绘制分时刻度线（左边白色数字）
    _drawLeftText() {
        const arr = this.getLeftData()
        this.画布上下文.font = "15px sans-serif";
        this.画布上下文.fillStyle = '#fff'
        this.画布上下文.beginPath()
        const diff_height = this.K线区高度 / this.分时刻度个数
        arr.reverse().forEach((v, i) => {
            this.画布上下文.fillText(v, 5, diff_height * (i + 1))
        })
    }

    /*通过坐标数组 绘制线*/
    _drawLine(arr, color = '#fff') {
        this.画布上下文.strokeStyle = color;
        arr.forEach((item, i) => {
            if (arr[i + 1]) {
                this.画布上下文.beginPath()
                this.画布上下文.moveTo(item.x, item.y);
                this.画布上下文.lineTo(arr[i + 1].x, arr[i + 1].y);
                this.画布上下文.stroke();
            }
        })
    }

    //绘制时间
    _drawTime() {
        const arr = this.getTimeArr()
        const draw_arr = this.getTimeCoord(arr)
        this.画布上下文.font = "15px sans-serif";
        this.画布上下文.fillStyle = '#fff'
        this.画布上下文.beginPath()
        for (let item of draw_arr) {
            this.画布上下文.fillText(item.v, item.x, item.y)
        }
    }

    /*
    * 绘制柱图
    * bar_data [x,y,width,height], color
    * */
    _drawBar(bar_data, color) {
        const initial = {
            width:this.k线柱宽度
        }
        bar_data = {
            ...bar_data,
            ...initial
        }
        this.画布上下文.beginPath();
        this.画布上下文.fillStyle = color;
        this.画布上下文.fillRect(bar_data.x, bar_data.y, bar_data.width, bar_data.height);
        this.画布上下文.stroke();
    }
}
