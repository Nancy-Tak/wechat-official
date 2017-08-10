import React from 'react';
import { withRouter } from 'react-router';
import {Icon, Card, WhiteSpace } from 'antd-mobile';
import { axios, session } from 'UTILS';
import ReactDOM,{findDOMNode} from 'react-dom';


import './style.less';

const icons = ['right']


class MyQrcode extends React.Component {
    constructor(props){
        super(props);
        this.state={};
    }

    render() {
        return (
            <div className="myQrcode">

               <h2 className="fs32">真功夫<span>（高德置地店）</span></h2>
               <div className="code">               
                   <img src="http://www.frontpay.cn/Content/images/qrcodenew.jpg"  />				    
               </div>
               <p className="fs22">已开通微信、支付宝扫码支付</p>


            </div>
        )
    }
}

export default MyQrcode;

