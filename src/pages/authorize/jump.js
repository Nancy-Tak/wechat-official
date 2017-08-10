import React from 'react';
import {Toast} from 'antd-mobile';
// import store from 'store';
import { axios,utfToBase64,tools} from 'UTILS';
const {base64encode,utf16to8} = utfToBase64;
class Jump extends React.Component {
    constructor(props) {    
        super(props);
        const {query} = this.props.location;
        location.href = tools.urlAddParam(query.url, query);
    }    

    render() {
        return (<div></div>)
    }
}

export default Jump;

