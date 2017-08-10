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
import { axios, session, tools,constants } from 'UTILS';
import './style.less'
import { createForm } from 'rc-form';
import { InfoDisplay } from 'COM';
import classname from 'classname';


class AccountManage extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        tools.setDocumentTitle('账户管理');
        this.state = {
            data: {},
        }
    }

    componentDidMount() {
        this.init()
    }

    init() {
        console.log("默认渲染")
        axios.get('/api/b/merchant/info').then(res => {
            console.log('roleCode',res.data.roleCode)
            this.setState({
                data: res.data
            });

        }).catch(error => {
            Toast.fail(error.message, 2);
        });

    }

    record = (id) => {
        const {router} = this.props;
        router.push(`/connectInfo/${id}`);
    }

    logOut=()=>{
        axios.get('/api/b/logout').then(res=>{
            const {router} = this.props;
            Toast.info('退出成功');
            router.push('/companyLogin');
        }).catch(error=>{
            Toast.fail(error.message, 2);
        });
    }

    render() {
        const { getFieldProps } = this.props.form;
        const { data } = this.state;
        if (!data) return null;

        let isPass=true;
        let shState='审核中';
        if(data.roleCode==1){
            //商户
            if(data.merchantAuditStatus == 0){
                isPass=false;
                shState='审核不通过';
            }else if(data.merchantAuditStatus ==1){
                isPass=true;
                if(data.merchantStatus==-1){
                    shState='审核中';
                }else if(data.merchantStatus ==1){
                    shState='审核通过';
                }else if(data.merchantStatus == 2){
                    shState='已禁用';
                }
            }else{
                shState='审核中';
                isPass=true;
            }
        }else{
            //门店
            let shopStatus=tools.getShopStatus(data.merchantAuditStatus,data.merchantStatus,data.auditStatus,data.status);
            shState = shopStatus.name;
            if(shopStatus.status==0){
                isPass=false;
            }else{
                isPass=true;
            }
        }

        //let auditStatus = data.auditStatus;
        //let passStatus = 0;
        ////let shopStatus=tools.getShopStatus(data.merchantAuditStatus,data.merchantStatus,data.auditStatus,data.status);
		////let shState = shopStatus.name;
		//if(shopStatus.status==0){
		//	passStatus = 2
		//}


        return (
            <div>
                {
                    !isPass ? (
                        <div styleName='tips'>
                            <div styleName='tipText'>
                                您的账户审核不通过，原因如下：
                            </div>
                            <NoticeBar mode="" icon={<Icon type="cross-circle-o" size="xxs" />}>

                                <div style={{color:'black'}}>
                                    {
                                        data.auditRemark
                                    }
                                </div>
                            </NoticeBar>
                             <WhiteSpace size="sm"/>
                        </div>

                    ) : null
                }


                <div styleName="infoBox">

                    {data.roleCode == '1' ? (
                        <div>
                            <div className="fn-mb-30">
                                <div styleName="key">企业名称</div>
                                <div styleName="vals">{data.name}</div>
                            </div>
                            <div className="fn-mb-30">
                                <div styleName="key">企业简称</div>
                                <div styleName="vals">{data.simpleName}</div>
                            </div>
                            <div className="fn-mb-30">
                                <div styleName="key">门店数量</div>
                                <div styleName="vals">{data.shopCount}</div>
                            </div>

                            <div className="fn-mb-30">
                                <div styleName="key">所属机构</div>
                                <div styleName="vals">{data.agencyName}</div>
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
                    ) : (
                        <div>
                            <div className="fn-mb-30">
                                <div styleName="key">门店名称</div>
                                <div styleName="vals">{data.name}</div>
                            </div>
                            <div className="fn-mb-30">
                                <div styleName="key">门店简称</div>
                                <div styleName="vals">{data.simpleName}</div>
                            </div>
                            <div className="fn-mb-30">
                                <div styleName="key">所属企业</div>
                                <div styleName="vals">{data.merchantName}</div>
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
                    )}

                </div>
                <WhiteSpace size="sm"/>
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
                <WhiteSpace size="sm"/>
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
                <WhiteSpace size="sm"/>
                {(data.bankName && data.bankAccountNoLast4 && data.roleCode==1)?(
                <div styleName="infoBox">
                    <div>
                        <div styleName="key">结算账户</div>
                        <div styleName="vals">{data.bankName} | 尾号{data.bankAccountNoLast4}</div>
                    </div>
                </div>
                ):null}

                <WhiteSpace size="sm"/>
                <WhiteSpace size="sm"/>
                {
                    data.roleCode == 1 && !isPass ? (
                        <div className="account-login-wrap">
                            <Button className="login" styleName="recordBtn" type="primary"
                                    onClick={()=>{this.record(data.id)}}>重新提交审核</Button>
                        </div>
                    )
                        : null
                }
                {
                  //  constants.systemConfig.isDev ? (
                        <div>
                            <Button type="primary" className="login" styleName="recordBtn"  onClick={this.logOut}>退出</Button>
                        </div>
                //    ) : null
               }
            </div>
        );
    }
}
export default withRouter(createForm()(AccountManage))
