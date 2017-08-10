import React from 'react';
import { withRouter } from 'react-router'
import {
	NavBar,
	WhiteSpace,
	List,
	Switch,
	Picker,
	Button,
	NoticeBar,
	Icon,
    Toast
} from 'antd-mobile';
import { axios, session, tools } from 'UTILS';
import './style.less'
import { createForm } from 'rc-form';
import { InfoDisplay } from 'COM';
import store from 'store';


class ShopsDetail extends React.Component {

	static contextTypes = {
		router: React.PropTypes.object.isRequired
	}

	static propTypes = {
		name: React.PropTypes.string,
	};

	constructor(props) {
		super(props);
		tools.setDocumentTitle('门店详情');
		this.state = {
			data: '',
			checkOn:false,

            shState:'审核中',
            shStateNub:'1'

		}
	}

	componentDidMount() {
		this.init()
	}
	init() {
        let id = this.props.location.query.id;
		axios.get(`/api/b/shop/${id}`).then(res => {
            let data=res.data;
            let shopStatus=tools.getShopStatus(data.merchantAuditStatus,data.merchantStatus,data.auditStatus,data.status);
			this.setState({
				data: data,
				checkOn:shopStatus.status ==2 ? true:false,
                shState:shopStatus.name,
                shStateNub:shopStatus.status
			});
		}).catch(error => {
			Toast.fail(error.message, 2);
		});
	}

	handleBackClick = () => {
		this.props.router.push(`/balance`)
	};
	nextStepClick = () => {
		this.props.router.push(`/companyLogin`)
	};
	checkFun=(status)=>{
        let id = this.props.location.query.id;
        console.log(status)
        axios.post(`/api/b/shop/${id}/changestatus`,{status:(!this.state.checkOn)==true?1:2})
            .then(res=>{
                this.setState({
                    checkOn:status,
                    shState:status ? '已通过' : '已禁用'
                });
            }).catch(error=>{
            Toast.fail(error.message, 2);
        });
	}

	enterCode = () => {
		const {router} = this.props;
        router.push(`/companyPlatform/qrCode/myQrcode?shopid=${this.state.data.id}`);
	}
	record = () => {
        console.log("record")
        const {router} = this.props;
        router.push(`/newConnectInfo?id=${this.state.data.id}`);
    }

	render() {
		const { getFieldProps } = this.props.form;
		const { data,checkOn ,shState,shStateNub} = this.state;
		const userInfo=store.get('USERINFO');

		const checkedBtn=checkOn;
		if(!data) return null;


        let isShowStartBtn=(userInfo.roleCode !=2 && (shStateNub==2 || shStateNub==-1)) ? true : false;


		return(
			<div>


			{shStateNub==0?(
				 <div styleName='tips'>
              <div styleName='tipText'>
                  您的账户审核不通过，原因如下：
              </div>
              <NoticeBar mode="" icon={<Icon type="cross-circle-o" size="xxs" />}>
                  <div style={{color:'black'}}>
                     {data.auditRemark}
                  </div>

              </NoticeBar>

         	 </div>
			):null}





			{isShowStartBtn?(
				<div>
				<WhiteSpace size="sm" />
		            <List>
		                <List.Item
		                    extra={<Switch
		                        {...getFieldProps('Switch1', {
		                            initialValue: checkedBtn,
		                            valuePropName: 'checked',
		                        })}
		                         onChange={(state)=>{this.checkFun(state)}}
		                    />}
		                >启用门店收款
		                </List.Item>
		            </List>

            </div>
			):null}
		{checkedBtn==true?(
			<div>
			<WhiteSpace size="sm" />
		            <div className="am-list-body shopFs28">
		                <div>
		                    <div className="am-list-item am-list-item-middle">
		                        <div className="am-list-line">
		                            <div className="am-list-content rebuildFontSize" onClick={this.enterCode}>
		                                	门店二维码
		                                <div
		                                    className="am-list-arrow am-list-arrow-horizontal"
		                                    styleName="nextIcon"
		                                >
		                                </div>
		                            </div>
		                        </div>
		                    </div>
		                </div>

		            </div>
            <WhiteSpace size="sm" />
             </div>
		):null}

            <div styleName="infoBox">
                <div className="fn-mb-30">
                    <div styleName="key">门店名称</div>
                    <div styleName="vals">{data.name}</div>
                </div>
                <div className="fn-mb-30">
                    <div styleName="key">门店简称</div>
                    <div styleName="vals">{data.simpleName}</div>
                </div>
                <div className="fn-mb-30">
                    <div styleName="key">经营地址</div>
                    <div styleName="vals">{data.address}</div>
                </div>
                <div>
                    <div styleName="key">客服电话</div>
                    <div styleName="vals">{data.customerServicePhone}</div>
                </div>
            </div>
            <WhiteSpace size="sm" />
            <div styleName="infoBox">
                <div className="fn-mb-30">
                    <div styleName="key">证件类型</div>
                    <div styleName="vals">{data.licenseTypeName}</div>
                </div>
                <div>
                    <div styleName="key">证件号码</div>
                    <div styleName="vals">{data.licenseNo}</div>
                </div>
            </div>
            <WhiteSpace size="sm" />
            <div styleName="infoBox">
                <div className="fn-mb-30">
                    <div styleName="key">联系人</div>
                    <div styleName="vals">{data.connector}</div>
                </div>
                <div>
                    <div styleName="key">联系电话</div>
                    <div styleName="vals">{data.phone}</div>
                </div>
            </div>
            <WhiteSpace size="sm" />
                {/*{(data.bankName && data.bankAccountNoLast4) ? (*/}
                    {/*<div styleName="infoBox">*/}
                        {/*<div>*/}
                            {/*<div styleName="key">结算账户</div>*/}
                            {/*<div styleName="vals">{data.bankName} | 尾号{data.bankAccountNoLast4}</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                {/*) : null}*/}

            <WhiteSpace size="sm" />
            <div styleName="infoBox">
                <div>
                    <div styleName="key">审核结果</div>
                    <div styleName="vals">{shState}</div>
                </div>
            </div>
            <WhiteSpace size="sm" />
		{shStateNub==0 && userInfo.roleCode!=2?(
		 <div className="account-login-wrap">
              <Button className="login" styleName="recordBtn" type="primary" onClick={this.record}>重新提交审核</Button>
          </div>
		):null}

      </div>
		);
	}
}
export default withRouter(createForm()(ShopsDetail))
