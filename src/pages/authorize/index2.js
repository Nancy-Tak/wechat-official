import React from 'react';
import {Toast} from 'antd-mobile';
// import store from 'store';
import { axios,utfToBase64,tools} from 'UTILS';
const {base64encode,utf16to8} = utfToBase64;
class Authorize2 extends React.Component {
    constructor(props) {    
        super(props);
        let {query} = this.props.location;
        console.log(query)
        this.getAuthorize(query.code);
    }

    getAuthorize(code){
        const { router} = this.props;
        axios.get(`/api/oauth2/index/${code}`).then(res=>{
            console.log(res);
            const {data} =res;
            if(res.status == '1'){
                const url = tools.urlAddParam('/index/frontpay', data);
                console.log(url);
                router.push(url)
                // store.set('SESSIONID',res.data.sessionId);
                // location.href = res.data.url;
            }else{
                Toast.fail(`${res.message}`, 2);
            }
        }).catch(error=>{
            Toast.fail(error.message, 2);
        });
    }    

    render() {
        return (<div></div>)
    }
}

export default Authorize2;