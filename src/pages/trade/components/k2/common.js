export default class{
    //获取数组平均值
    static getAveByArr(arr){
        const result = arr.reduce((total, value) =>{
            return Number(total) + Number(value)
        })
        return result / arr.length
    }
    static qingjingzhi(sz, index, val) {
        let avg = 0;
        let sum = 0;
        let start = index < val ? 0 : (index - (val - 1));
        let end = index + 1;
        for (let i = start; i < end; i++) {
            sum += Number(sz[i]);
        }
        avg = sum / (index < val ? index + 1 : val);
        return avg.toFixed(4);
    }
}
