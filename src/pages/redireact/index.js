import React from 'react';
import { withRouter } from 'react-router';
import {
    Icon, Button, InputItem,
    WhiteSpace, Toast,List,WingBlank
} from 'antd-mobile';
import { axios, tools } from 'UTILS';
import store from 'store';

class Redireact extends React.Component{
    constructor(props){
        super(props);
        this.state={};

    }

    componentWillMount(){
        // Clear all keys
        store.clearAll();
    }

    componentDidMount(){
        //此处从行方跳转过来的url中获取
        // OPENID : 微信用户在公众号下的openid
        // enc : 校验跳转来源合法性的字段
        // timestamp : 时间戳

        console.log('this.props.location:',this.props.location);
        const { router } = this.props;
        const { query,pathname } = this.props.location;
        axios.post(`/api${pathname}`,query).then(res=>{
            console.log('redirect--res:',res);
            if(res.status == '1'){
                store.set('OPPENID',res.data.openId);
                store.set('SESSIONID',res.data.sessionId);
                switch (res.data.location){
                    case 0:
                        router.push('/companyLogin');//跳转到登录页面
                        break;
                    case 1:
                        router.push('/companyPlatform');//商户平台页面
                        break;
                    case 2:
                        router.push('/cashierCenter');//收银员平台页面
                        break;
                    default:
                        router.push('/companyLogin');//跳转到登录页面
                }
            }else{
                Toast.fail(`(${res.status})${res.message}`, 2);
            }
        }).catch(error=>{
            Toast.fail(error.message, 2);
        })
    }

    render(){
        return(
            <div>页面加载中...</div>
        )
    }
}

export default Redireact;
