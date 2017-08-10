import React from 'react';
import { withRouter } from 'react-router';
import {Icon, Card, WhiteSpace,Toast } from 'antd-mobile';
import { axios, session,tools } from 'UTILS';
import ReactDOM,{findDOMNode} from 'react-dom';


import './style.less';

const icons = ['right']


class MyQrcode extends React.Component {
    constructor(props){
        super(props);
        tools.setDocumentTitle('二维码');
        this.state={
        	data:''
        };
    }
	componentDidMount() {
		this.init()
	}
	init(){
		let id = this.props.location.query.shopid;
		axios.get(`/api/b/qrcode/${id}`).then(res => {
			this.setState({
				data: res.data,
			});
		}).catch(error => {
			
			Toast.fail(error.message, 2);
		});
	}
    render() {
    const { data } = this.state;
        return (
            <div className="myQrcode">

               <h2 className="fs32">{data.name}</h2>
               <div className="code">               
                   <img src={data.img}  />				    
               </div>
               <p className="fs22">已开通微信、支付宝扫码支付</p>


            </div>
        )
    }
}

export default MyQrcode;

