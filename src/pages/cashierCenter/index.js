import React from 'react';
import { withRouter,Link } from 'react-router'
import {
	NavBar, Tabs, WhiteSpace, Icon, Toast, Button, InputItem, List, WingBlank
} from 'antd-mobile';
import AlertComponent from 'COM/alert/alert';
import { createForm } from 'rc-form';
import { axios, session, tools } from 'UTILS';
import classname from 'classname';

import './style.less'
import store from 'store';
import setting from 'ASSETS/svg/setting.svg';
import refreshIcon from 'ASSETS/svg/refresh.svg';


class CashierCenter extends React.Component {
	constructor(props) {
		tools.setDocumentTitle('收银员个人中心');
		super(props);
		this.state = {
			billLists: [],
		};
	}

	componentDidMount() {
		this.fetchTradeFlowData(1, 100);
		axios.all([this.getCashierInfo(), this.getTotalAccount(), this.getTotalCount()])
			.then(axios.spread((cashierInfo, totalAccount, totalCount) => {
				console.log(cashierInfo);
				console.log(totalAccount);
				console.log(totalCount);

				let { realName, shopName,isBind,remindStatus} = cashierInfo.data;
				remindStatus = parseInt(remindStatus, 10);


                //判断是否已关闭过开启收款弹窗 
				let closePop = sessionStorage.getItem("closeNotePop")||false;
				console.log('管理员是否允许开启',remindStatus);
				console.log('是否绑定微信',isBind);
				console.log('是否关闭过弹窗',closePop);
				if(remindStatus && isBind == false && !closePop){//没有绑定和没有关闭过弹窗
					isBind = true;       //开启收款弹窗出现
					console.log('弹窗出现');
				}else{
					isBind = false         //开启收款弹窗不出现
					console.log('弹窗不出现');
				}


				this.setState({
					realName: realName,
					shopName: shopName,
					totalAccount: totalAccount.data.total,
					totalCount: totalCount.data.count,
					isBind:isBind
				});
			}));
	}

	goSetPay = () => {
		const { router } = this.props;
		router.push('/cashierCenter/setAmount');
	}

	goAccountManage = () => {
		const { router } = this.props;
		router.push('/cashierCenter/accountManage');
	}

	//获取收款人信息
	getCashierInfo = () => {
		return axios.get('/api/b/shopassistant/info');
	}
	//获取收款总额
	getTotalAccount = () => {
		return axios.get('/api/b/bill/shopassistant/total');
	}
	//获取收款笔数
	getTotalCount = () => {
		return axios.get('/api/b/bill/shopassistant/count');
	}


	//刷新交易流水信息
	freshTradeFlowData = () => {
		this.fetchTradeFlowData(1, 100);
	}

	// 获取数据
	fetchTradeFlowData = (pageNum, pageSize) => {
		axios.post('/api/b/bill/shopassistant/orderflow', { pageNum, pageSize }).then(res => {
			const lists = res.data.list || [];
			const total = res.data.total;
			if (pageNum == '1') {
				this.setState({
					billLists: lists,
					total: total,
				});
			}
		}).catch(error => {
			Toast.fail(error.message, 2);
		});

	}

	// 渲染列表
	getContent = () => {
		if (this.state.billLists.length > 0) {
			return this.state.billLists.map((list, index, lists) => {
				let preListDate = 0;
				if (index != 0) {
					preListDate = new Date(lists[index - 1].completeTime);
				}
				let date = new Date(list.completeTime);
				let isShowY = 'none';
				if (preListDate != 0 && preListDate.getFullYear() != date.getFullYear()) {
					isShowY = 'block';
				}
				let year = date.getFullYear();
				let day = date.getMonth() + 1 + '-' + date.getDate();
				if (new Date().getMonth() == date.getMonth() && new Date().getDate() == date.getDate()) {
					day = '今天';
				}
				//let time = date.getHours() + ':' + date.getMinutes();
                let minutes=date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
                let time =date.getHours() +':'+minutes;
				let cls1 = classname({
					icon: true,
					out: list.payType == '3' ? true : false,
					in: list.payType == '1' ? true : false
				});
				let cls2 = classname({
					red: list.payType == '3' ? true : false
				});
				let orderAmount = list.payType == '1' ? list.amount : `-${list.amount}`;
				return (
					<div key={index}>
						<WingBlank style={{ display: isShowY }}>
							<div className="yearTip">
								<span>{year}年</span>
							</div>
						</WingBlank>
						<div className="bill-item">
							<div className="time">
								<div>{day}</div>
								<div>{time}</div>
							</div>
							<div className={cls1}></div>
							<div className="info">
								<div
									className={cls2}>{list.payType == '1' ? '+' : null}{tools.thousands_separators(orderAmount)}</div>
								<div>{list.payerName}</div>
							</div>
						</div>
					</div>
				)
			})
		} else {
			return <div className="noData">暂无数据</div>
		}
	}
    
    //弹窗事件
    alertRight = () =>{
    	const {router} = this.props;
    	sessionStorage.setItem("closeNotePop",true);//已经关闭过弹窗了
        router.push({
            pathname: '/cashierCenter/payNote'
        });
    }
    alertLeft = () =>{
		this.setState({
			isBind:false //关闭弹窗
		});
		sessionStorage.setItem("closeNotePop",true);//已经关闭过弹窗了
    }
    alertClose = () =>{
		this.setState({
			isBind:false //关闭弹窗
		});
		sessionStorage.setItem("closeNotePop",true)//已经关闭过弹窗了
    }


	render() {
		const { realName, shopName, totalAccount, totalCount,isBind } = this.state;
		let buttons;
		if(isBind){
			//弹出按钮的方法
		    buttons = {
		        left:{
		        	text:'暂不',
		        	onPress:this.alertLeft
		        },
		        right:{
		        	text:'开启',
		        	onPress:this.alertRight
		        },
		        close:{
		        	onPress:this.alertClose
		        }
		    }
		}


		return (
			<div>
			    {
                    isBind ? <AlertComponent linedTitle="开启" title="收款通知" subTitle="确保资金到位，收款及时通知" buttons={buttons}/>:null
			    }
				{/*用户头部*/}
				<div styleName="header-v123">
					<Icon type={setting} styleName="setting" onTouchEnd={this.goAccountManage}/>
					<div styleName="user">
						<img src={require('ASSETS/images/user.png')} alt="" styleName="headshot" />
						<h2>{realName}</h2>
						<p>{shopName}</p>
					</div>
					<div styleName="count">
						<div>
							<h2>
								{tools.thousands_separators(totalAccount)}
							</h2>
							<p>
								成功收款(元)
							</p>
						</div>
						<div>
							<h2>
								{totalCount}
							</h2>
							<p>
								已收款笔数
							</p>
						</div>
					</div>
				</div>
				{/*我要收款*/}
				<div styleName="rec-wrap">
					<Link to="/cashierCenter/setAmount"><div styleName="rec" ></div></Link>
				</div>
				{/*交易流水*/}
				<div styleName="record">
					<Icon
						type={refreshIcon}
						styleName="refresh"
						onTouchEnd={this.freshTradeFlowData}
					/>
				</div>
				<div className="mybills">
					<div className="content first-highLight">
						{this.getContent()}
					</div>
				</div>


			</div>
		);
	}
}
export default CashierCenter;

