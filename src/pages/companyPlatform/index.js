import React from 'react';
import { withRouter } from 'react-router';
import {
    Icon, Button, InputItem,
    WhiteSpace, Toast,List,WingBlank
} from 'antd-mobile';
import { createForm } from 'rc-form';
import { axios, tools } from 'UTILS';
import './style.less';
import store from 'store';

class CompanyPlatformIndex extends React.Component{
    constructor(props){
        super(props);
        tools.setDocumentTitle('企业平台');
        this.state={
        	data:'',
        	monthData:'',
        	pop:false,
        	popNum:0,
        	str1:"您的账户正在审核中，服务暂不可用，请耐心等待结果。",
        	str2:"门店信息审核中，请耐心等待结果。",
        	str3:"您的账户未通过审核，服务暂不可用，请重新提交审核或联系客服：400-9928-699。",
        	str4:"门店信息审核不通过，请联系您的商户重新提交审核信息。",
        	str5:"商户未通过审核，服务暂不可用，请联系您的所属商户。",
        };
    }
	componentDidMount() {
		this.init()
	}
	init() {

		axios.get('/api/b/merchant/index').then(res => {
			this.setState({
				data: res.data
			});
			store.set('USERINFO',res.data);
		}).catch(error => {
			Toast.fail(error.message, 2);
		});

		axios.get('/api/b/report/month').then(res => {
			this.setState({
				monthData: res.data
			});
		}).catch(error => {
			Toast.fail(error.message, 2);
		});


	}

    goAccoutMag=()=>{
        const {router} = this.props;
        router.push('/companyPlatform/accountManage');
    }

    goMyBills=()=>{
        const {router} = this.props;
        router.push('/companyPlatform/myBills');
    }

    goQrcode=()=>{
        const {router} = this.props;
        router.push('/companyPlatform/qrCode');
    }
    goQrcode2=()=>{
       this.setState({
				pop: true
		});
    }

    goStoreMag=(e)=>{
        e.preventDefault();
        const {router} = this.props;
        // router.push('/companyPlatform/addSalesMan');
        router.push('/companyPlatform/storeManagement');
    }

    goSalesMag=(e)=>{
        e.preventDefault(); // 修复 Android 上点击穿透
        const {router} = this.props;
        router.push('/companyPlatform/salesManagement');
    }
    colsePop=()=>{
    	this.setState({
				pop: false
		});
    }

    goPeopsleManager=()=>{
        console.log('goPeopsleManager')
        const {router} = this.props;
        router.push('/companyPlatform/peopleManagement');
    }
    render(){
    	 const {data,monthData,pop,popNum,str1,str2,str3,str4,str5} = this.state;
    	 let user=data.roleCode;
    	 let str=str1;
    	 let ptState='审核中';
    	 if(!data) return null;
    	 //if(!monthData) return null;

    	 let num=0;

    	 if(data.merchantAuditStatus==-1){
    	 	num=-1;
    	 	str=str1;
    	 }else if(user==1 && data.merchantAuditStatus==0){
    	 	str=str3;
    	 	num=-1;
    	 }else if(user==2 && data.merchantAuditStatus==0){
    	 	str=str5;
    	 	num=-1;
    	 }else if(user==2 && data.auditStatus==-1){
    	 	str=str2;
    	 	num=-1;
    	 }else if(user==2 && data.auditStatus==0){
    	 	str=str4;
    	 	num=-1;
    	 }

    	 if(user==1){
    	 	if(data.merchantAuditStatus==0){
    	 		ptState='审核不通过'
    	 	}else if(data.merchantAuditStatus==1 && data.merchantStatus==1){
    	 		ptState='审核通过'
    	 	}else if(data.merchantAuditStatus==1 && data.merchantStatus==2){
                ptState='已禁用'
            }
    	 }else{
    	 	ptState=tools.getShopStatus(data.merchantAuditStatus,data.merchantStatus,data.auditStatus,data.status).name;
    	 }


        return(
            <div className="companyPlatform">
            		{pop==true?(
            			<div className="popSh">
                    	<div>
							<p>{str}</p>
							<a href="#" onClick={this.colsePop}>确定</a>
						</div>
					</div>
            		):null}


                  <header className="banner">
                    <div className="companyName-wrap">
                        <span className="companyName">{data.name}</span>
                        {ptState=='审核通过' ? null : <span className="companyStatus">{ptState}</span>}
                    </div>
                    <div className="btn-account">
                        <span onTouchStart={this.goAccoutMag}>账户管理 ></span>
                    </div>
                </header>
                <div className="content">
                    <div className="content-item-bill">
                        <div className="left">
                            <div className="amount">
                                <div>本月收入(元)</div>
                                <div>{tools.thousands_separators(monthData.totalAmount)}</div>
                            </div>
                            <div className="count">
                                <div>本月交易数(笔)</div>
                                <div>{monthData.totalOrderNum}</div>
                            </div>
                        </div>

                    </div>
                    <div className="content-item-shop">
                    {/*
//                      <div className="left">
//                          <div className="fs22">门店数量</div>
//                          <div className="fs27">{data.shopCount}</div>
//                      </div>
*/}
 					<div className="right" onTouchStart={this.goMyBills}>
                            <div className="item-icon2"></div>
                            <div className="icon-t">我的账单</div>
                        </div>
                        {/*<div className="right" onTouchStart={this.goStoreMag}>*/}
                        <div className="right" onClick={this.goStoreMag}>
                            <div className="item-icon"></div>
                            <div className="icon-t">门店管理</div>
                        </div>
                         {/*<div className="right" onTouchStart={this.goSalesMag}>*/}
                         <div className="right" onClick={this.goSalesMag}>
                            <div className="item-icon3"></div>
                            <div className="icon-t">店员管理</div>
                        </div>
                    </div>
                    <p className="Referral">推荐服务</p>
                    <div className="content-item-qrcode">

                    <img src={require('ASSETS/images/indexImg.jpg')} alt="" className="indexImg" />

                        {/*
                        {num==0?(
                        	<div className="right" onTouchStart={this.goQrcode}>
                            <div className="item-icon"></div>
                            <div className="icon-t">我的二维码</div>
                        </div>
                        ):null}
                         {num==-1?(
                        	<div className="right" onTouchStart={this.goQrcode2}>
                            <div className="item-icon"></div>
                            <div className="icon-t">我的二维码</div>
                        </div>
                        ):null}
                        */}

                    </div>
  {/*
                    <div
                        className="content-item-qrcode-tips"
                        onClick={this.goPeopsleManager}
                    >
                        <div className="fs22">店员管理</div>
                        <div className="fs22">每笔收款实施提醒</div>
                    </div>
                      */}
                </div>
            </div>
        );
    }
}

export default CompanyPlatformIndex;
