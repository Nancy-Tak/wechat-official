import React from 'react';
import { withRouter } from 'react-router'
import {
    NavBar,Tabs, WhiteSpace
} from 'antd-mobile';
import { createForm } from 'rc-form';
import { axios, session,tools } from 'UTILS';
import PhoneLoginForm from './phoneLoginForm';
import AccountLoginForm from './accountLoginForm';
import './style.less'
import store from 'store';

const TabPane = Tabs.TabPane;


class Login extends React.Component {
    constructor(props) {
    	tools.setDocumentTitle('企业登录');
        super(props);
        this.state = {}
    }

    componentWillMount() {
        //去掉弹出框的缓存
       sessionStorage.removeItem("closeNotePop")
    }
    componentDidMount(){
        //store.remove('SESSIONID');
        }


    callback = (key)=> {
        console.log('onChange', key);
    }
    handleTabClick = (key)=> {
        console.log('onTabClick', key);
    }

    nextStepClick=()=>{
        this.props.router.push('/connectInfo');
        store.remove('procecssCode')
    }

    //跳转到账号激活流程
    goActivateAssistant=()=>{
        this.props.router.push('/activate/searchShopList');
    }


        // copyUrl = () => {
        //     const a = 'www.baidu.com'
        //     copy(a);
        //     if(copy(a)){
        //         alert(a);
        //     }
        //
        // };

    render() {

        return (
            <div>
                {/*
                 <NavBar
                 className="navBar"
                 onLeftClick={() => {
                 this.props.router.push('/appCenter');
                 }}
                 >
                 企业登录
                 </NavBar>
                 */}

                <div className="login-container">
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="手机号登录" key="1" style={{color:'red'}}>
                            <div>
                                <div>
                                    <PhoneLoginForm />
                                    <div onClick={this.nextStepClick} className="linkCls">
                                        还没有账号，立即入驻
                                    </div>
                                    {/*<button onClick={this.copyUrl}>copy and share </button>*/}
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="账号登录" key="2">
                            <div>
                                <div>
                                    <AccountLoginForm/>
                                    <div className="linkClsBox">
                                        <div onClick={this.nextStepClick} className="linkCls">
                                            立即入驻
                                        </div>
                                        <div onClick={this.goActivateAssistant} className="linkCls">
                                            账号激活
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>


            </div>
        );
    }
}
export default withRouter(createForm()(Login))

