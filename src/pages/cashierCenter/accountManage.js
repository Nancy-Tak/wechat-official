import React from 'react';
import { withRouter } from 'react-router'
import {
    NavBar,Tabs, WhiteSpace,Toast
} from 'antd-mobile';
import { createForm } from 'rc-form';
import { axios, session,tools } from 'UTILS';

import './style.less'
import store from 'store';



class CashierCenter extends React.Component {
    constructor(props) {
        tools.setDocumentTitle('账号管理');
        super(props);
        this.state = {
            data:{}
        }
    }

    componentWillMount() {
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

    goCenter = () => {
        const {router} = this.props;
        router.push('/cashierCenter')
    }

    componentDidMount(){
        axios.get('/api/b/shopassistant/info').then(res=> {
            this.setState({
                data: res.data
            });
        }).catch(error=> {
            Toast.fail(error.message, 2);
        });
    }

    render() {
        const {name,realName,shopName} = this.state.data;
        return (
            <div className="cashierAccountManage">

                <div className="_item">
                    <span className="label">姓名</span>
                    <span className="value">{realName}</span>
                </div>
                <div className="_item">
                    <span className="label">账号名</span>
                    <span className="value">{name}</span>
                </div>
                <div className="_item">
                    <span className="label">所属门店</span>
                    <span className="value">{shopName}</span>
                </div>
                <div className="btn-box">
                    <div className="btn btnGoCenter" onTouchEnd={this.goCenter} >返回个人中心</div>
                </div>
                <div className="btn-box">
                    <div className="btn btnExit" onTouchEnd={this.logOut} >退出登录</div>
                </div>
            </div>
        );
    }
}
export default CashierCenter;
