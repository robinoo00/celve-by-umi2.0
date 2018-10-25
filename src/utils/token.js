import {CID} from '@/utils/params'
import {NoNeedCid} from '@/defaultSettings'
import router from 'umi/router'

export default class Token{
    constructor(){
        this.cid = localStorage.getItem(CID)
    }
    ifNeddCid(url){
        let port
        if(url.includes('?')){
            let match = ''
            if(url.includes('api/api')){
                match = url.match(/api\/api\/(\S*)\?/);
            }else if(url.includes('/app/')){
                match = url.match(/app\/(\S*)?/);
            }else if(url.includes('/dmapi/')){
                match = url.match(/dmapi\/(\S*)?/);
            }
            port = match[1]
        }else{
            const arr = url.split('/')
            port = arr[arr.length-1]
        }
        if(!NoNeedCid.includes(port)){//需要cid的接口
            return true
        }else{
            return false
        }
    }
    checkCid(){
        if(!this.cid){
            return false
        }else{
            return true
        }
    }
    static setCid(cid){
        localStorage.setItem(CID,cid)
    }
    static clearCid(){
        localStorage.removeItem(CID)
    }
    getCid(){
        return this.cid
    }
    noCidCallBack(){
        router.push('/account/login')
        throw new Error("no cid")
    }
}
