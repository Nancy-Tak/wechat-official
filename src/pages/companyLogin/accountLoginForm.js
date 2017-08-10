import React from 'react';
import { withRouter } from 'react-router';
import {
    Icon, Button, InputItem,
    WhiteSpace, Toast,List,WingBlank
} from 'antd-mobile';
import { createForm } from 'rc-form';
import { axios, tools } from 'UTILS';
import './accountLoginForm.less';
import store from 'store';
import TipsLogo from 'ASSETS/images/tipsLogo.png';

class AccountLoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    //getUserInfo = () => {
    //    const v = new Date().getTime();
    //    return axios
    //        .all([axios.get('/api/user/merchant' + '?' + v), axios.get('/api/user/user' + '?' + v)])
    //        .then(axios.spread((merchant, user) => {
    //            return {merchant, user};
    //        }))
    //};


    submit = () => {
        const { form } = this.props;

        form.validateFields((errors, value) => {

            if (errors) {
                tools.showError(errors);
            } else {
                console.log('ok~~~value:',value);
                axios.post('/api/login', value).then(res=>{
                    console.log(res);
                    if(res.status == '1'){
                        store.set('SESSIONID',res.data.sessionId);
                        if(res.data.location===2){
                            this.props.router.push('/cashierCenter');
                        }else{
                            this.props.router.push('/companyPlatform');
                        }

                    }else{
                        Toast.fail(`${res.message}`, 2);
                    }
                }).catch(error=>{
                    Toast.fail(error.message, 2);
                });
            }
        });
    };

    render() {
        const { data } = this.state;
        const { getFieldProps, getFieldValue, getFieldError } = this.props.form;

        const fieldProps = {
            username: {
                validateTrigger: 'onBlur',
                rules: [
                    {
                        required: true,
                        message: '账号不能为空'
                    },
                    {
                        pattern: /^\S*$/,
                        message: '不支持输入空格',
                    },
                    {
                        min:1,
                        max:32,
                        message:'账号名格式有误'
                    }
                ]
            },
            password: {
                validateTrigger: 'onBlur',
                rules: [
                    {
                        required: true,
                        message: '密码不能为空'
                    },
                    {
                        max:20,
                        message:'密码格式有误'
                    }
                ]
            }
        };

        return (
            <div className="account-login-wrap">
                <div style={{height:'30px'}}></div>
                <div
                    style={{display:'none'}} className='tipsText'><span>!</span>请使用E收款服务注册的手机号登录，<br/>收银员仅支持账号登录。</div>
                <List>
                    <InputItem
                        placeholder="请输入账号"
                        {...getFieldProps('username', fieldProps['username'])}
                        error={!!getFieldError('username')}
                        onErrorClick={
                           () => {
                           Toast.fail(getFieldError('username'), 2);
                           }}
                    ></InputItem>
                    <InputItem
                        placeholder="请输入密码"
                        {...getFieldProps('password', fieldProps['password'])}
                        error={!!getFieldError('password')}
                        type="password"
                        onErrorClick={
                            () => {Toast.fail(getFieldError('password'),2);}
                         }
                    ></InputItem>
                </List>
                <div className="tipsText">
                    <img
                        src={TipsLogo} alt=""/>
                     <div>
                         请使用E收款服务账号密码登录，收银员仅支持账号登录。
                    </div>
                </div>
                <WingBlank>
                    <Button className="login" type="primary" onTouchStart={this.submit}>登录</Button>
                </WingBlank>
            </div>
        );
    }
}

export default withRouter(createForm()(AccountLoginForm))




