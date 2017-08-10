import React from 'react';
import {Toast} from 'antd-mobile';
// import store from 'store';
import { axios,utfToBase64} from 'UTILS';
const {base64encode,utf16to8} = utfToBase64;
class Authorize extends React.Component {
    constructor(props) {    
        super(props);
        this.getAuthorize();
    }

    getAuthorize(){
        const { query } = this.props.location;
        const {url} = query;
        let base64url = base64encode(utf16to8(`http://${location.host}/jump?url=${url}`));
        base64url =  encodeURIComponent(base64url);
        // base64url=100;
        axios.get(`/api/oauth2/authorize/${base64url}`).then(res=>{
            console.log(res);
            if(res.status == '1'){
                // store.set('SESSIONID',res.data.sessionId);
                location.href = res.data.url;
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

export default Authorize;




