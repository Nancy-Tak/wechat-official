import React from 'react';
import {
    Toast,List,Tabs
} from 'antd-mobile';
import store from 'store';
import { axios, tools,ruleType} from 'UTILS';
import './shopList.less';

class GetShopOpenID extends React.Component {
    constructor(props) {    
        super(props);
        tools.setDocumentTitle(' ');
        let {query} = this.props.location;
        this.state={
            code:query.code
        } 
        this.getRedireact();   
    }
    getRedireact(){
        const {code} = this.state;
        axios.get(`/api/oauth2/openid/${code}`).then(res=>{
            console.log('redirect--res:',res);
            if(res.status == '1'){
                if(!res.data.openId){
                    store.get('OPPENID')?null:history.go(-3);
                }else{
                    store.set('OPPENID',res.data.openId);
                }  
                store.set('SESSIONID',res.data.sessionId);
                this.setState({
                    openId:res.data.openId,
                    sessionId:res.data.sessionId,
                });
                //未绑定状态=0
                this.getShopList(0);
            }else{
                Toast.fail(`(${res.status})${res.message}`, 2);
            }
        }).catch(error=>{
            Toast.fail(error.message, 2);
        })
    }
    /**
     * [getShopList description]
     * @param  {[type]} status [状态,0:未绑定;1:绑定]
     * @return {[type]}        [description]
     */
    getShopList(status){
        const {openId,sessionId,code} = this.state;
        const {router} = this.props;
        status = status==1;
        axios.get(`/api/shopassistant/${status}`).then((res)=>{
            console.log('返回门店列表',res.data);
            if(res.status == '1'){
                location.href = `${location.protocol}//${location.host}/shopList?code=${code}&hasUnbind=${res.data.length>0}`               
            }else{
                Toast.fail(`${res.message}`, 2);
            }
        }).catch(error=>{
            Toast.fail(error.message, 2);
        });
    }
    render() {
        return (<div></div>);

    }
}

export default GetShopOpenID;