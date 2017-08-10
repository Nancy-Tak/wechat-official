import React from 'react';
import { withRouter } from 'react-router'
import {
    NavBar,Tabs, WhiteSpace,Toast
} from 'antd-mobile';
import { createForm } from 'rc-form';
import { axios, session,tools } from 'UTILS';

import classname from 'classname';

import './style.less'
import store from 'store';



class TradeComfirm extends React.Component {
    constructor(props) {
        tools.setDocumentTitle('确认交易');
        super(props);
        this.timer=null;
        this.state = {
            orderInfo:{}
        }
    }

    componentWillMount() {
        console.log(this.props.location.query);
    }
    componentDidMount(){
        const {orderId} = this.props.location.query;
        let amountInfo=this.props.location.query;
        axios.get(`/api/b/order/${orderId}`).then(res=> {
            this.setState({
                orderInfo: res.data,
                amountInfo:amountInfo  //上上一个页面创建订单的信息保存起来方便重新下单
            });
            this.pollingForResult(orderId);
        }).catch(error=> {
            Toast.fail(error.message, 2);
        });



    }

    //刷新--重新下单
    reCreateOrder=()=>{
        //重新下单前把定时器关掉
        console.log('reCreateOrder...');
        this.timer && clearInterval(this.timer);
        this.timer = false;

        const {orderAmount,payerId,remark} = this.state.amountInfo;
        const postData = {
            orderAmount,
            payerId,
            remark
        };
        console.log('重新下单--传参的金额',postData.orderAmount);
        //重新下单
        axios.post('/api/b/order/create',postData).then(res => {
            const orderId = res.data.id;
            //下单成功后根据 orderid 获取订单信息
            axios.get(`/api/b/order/${orderId}`).then(res=> {
                console.log('重新获取订单信息成功 :',res.data);
                this.setState({
                    orderInfo: res.data
                });
                this.pollingForResult(orderId);
            }).catch(error=> {
                Toast.fail(error.message, 2);
            });
        }).catch(error => {
            console.log(error);
            Toast.fail(error.message, 2);
        })
    }

    pollingForResult(orderId){
        this.timer=setInterval(()=>{
            axios.get(`/api/b/payment/${orderId}`,{isHideLoding:true}).then(res=> {
                let data=res.data;
                const {router} = this.props;
                if(data.payState===1){//付款成功
                    clearInterval(this.timer);
                    router.push({
                        pathname:'/cashierCenter/paySuccess',
                        query:{
                            payerName:data.payerName,
                            paymentNo:data.paymentNo,
                            amount:data.amount
                        }
                    });
                }else if(data.payState===0){
                    clearInterval(this.timer);
                    router.push('/cashierCenter/payFail');
                }else{
                    console.log('data:',data);
                }
            }).catch(error=> {
                Toast.fail(error.message, 2);
            });
        },3000)
    }

    //离开时，清除定时器
    componentWillUnmount(){
        this.timer && clearInterval(this.timer);
        this.timer = false;
    }

    render() {
        const {orderAmount,payerName,id,imgData} = this.state.orderInfo;
        const qrcodeUrl='/api/payment/qrcode/'+id;

        //计算金额长度
        //let orderAmount1 = 10000.00;
        let displayAmount = tools.thousands_separators(orderAmount);
        let amountLen = displayAmount.length;
        let amountSize = 50;
        console.log('长度',amountLen);
        if(amountLen < 11){
            amountSize = 60;
        }else if(amountLen < 13){
            amountSize = 53;
        }else if(amountLen >=13){
            amountSize = 50;
        }
        amountSize = amountSize+'px';
        console.log('字体大小',amountSize);


        if(!id) return null;
        return (
            <div>
                <div styleName="trade-confirm">
                    <div styleName="gatherMess-box">
                        <h2 style={{display:payerName?'true':'none'}}>
                            {payerName}
                        </h2>

                        <p>
                            <b style={{fontSize:amountSize}}>
                                {displayAmount}
                            </b>
                        </p>
                    </div>
                    <img src={qrcodeUrl} alt="" styleName="rcode"/>
                    <span styleName="notice">
                        扫一扫，向我付款
                    </span>
                    <span styleName="refreshNote" onClick={this.reCreateOrder}>
                        <span styleName="keyNote">点击刷新</span>二维码
                    </span>
                    <div styleName="bottom"></div>
                </div>
            </div>
        );
    }
}
export default TradeComfirm;

