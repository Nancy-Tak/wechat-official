import React from 'react';
import { withRouter } from 'react-router';
import {
    Icon, Button, InputItem,
    WhiteSpace, Toast, List, WingBlank
} from 'antd-mobile';
import { createForm } from 'rc-form';
import { axios, tools,ruleType } from 'UTILS';
import store from 'store';
import './phoneLoginForm.less';
import TipsLogo from 'ASSETS/images/tipsLogo.png';

class PhoneLoginForm extends React.Component{
    constructor(props){
        super(props);
        this.state={
            btnSmsCodeText:'获取验证码',
            isBtnSmsCodeDisabled:false
        };
        this.timer=null;
    }

    submit = () => {
        const { form } = this.props;

        form.validateFields((errors, value) => {
            if (errors) {
                tools.showError(errors);
            } else {
                console.log('ok~~~value:',value);
                axios.post('/api/login/phone', value).then(res=>{
                    console.log(res);
                    if(res.status == '1'){
                        store.set('SESSIONID',res.data.sessionId);
                        this.props.router.push('/companyPlatform');
                    }else{
                        console.log(res,'res')
                        Toast.fail(`${res.message}`, 2);
                    }
                }).catch(error=>{
                    Toast.fail(error.message, 2);
                });
            }
        });
    };

    getCode=()=>{
        if(this.state.isBtnSmsCodeDisabled) return;
        let phone=this.props.form.getFieldValue('phone');
        let error=this.props.form.getFieldError('phone');
        console.log(error);
        if(!phone) return Toast.info('请输入手机号码');
        if(error){
            return Toast.info(error[0]);
        }
        axios.get(`/api/login/verifycode/${phone}`).then(res=>{
            console.log(res);
            if(res.status == '1'){
                this.countDown();
                Toast.info('短信验证码已发送，请填写', 3);
            }else{
                Toast.fail(`(${res.status})${res.message}`, 2);
            }
        }).catch(error=>{
            Toast.fail(error.message, 2);
        });
    }

    countDown=()=>{
        this.setState({
            isBtnSmsCodeDisabled:true
        });

        var count=60;
        this.timer = setInterval(()=>{
            count--;
            if(count>0){
                this.setState({
                    btnSmsCodeText:`${count}秒后重新获取`
                });
            }else{
                clearInterval(this.timer);
                this.setState({
                    btnSmsCodeText:`获取验证码`,
                    isBtnSmsCodeDisabled:false
                });
            }
        },1000)
    }

    //离开时，清除定时器
    componentWillUnmount(){
        this.timer && clearInterval(this.timer);
        this.timer = false;
    }

    goToSupplementUser=()=>{
        console.log('goToSupplementUser')
    }
    render(){
        const { getFieldProps, getFieldValue, getFieldError } = this.props.form;

        const fieldProps = {
            phone: {
                validateTrigger: 'onBlur',
                rules: [
                    {
                        required: true,
                        message: '手机号不能为空'
                    },
                    {
                        pattern: /^\S*$/,
                        message: '不支持输入空格',
                    },
                    ruleType('mobile')
                ]
            },
            code: {
                validateTrigger: 'onBlur',
                rules: [
                    {
                        required: true,
                        message: '验证码不能为空'
                    },
                    ruleType('number'),
                    {
                        len:6,
                        message:'请输入6位的验证码'
                    }
                ]
            }
        };
        return(
            <div className="phone-login-wrap">
                <div style={{height:'30px'}}></div>
                <List>
                    <InputItem
                        placeholder="请输入手机号"
                        {...getFieldProps('phone', fieldProps['phone'])}
                        error={!!getFieldError('phone')}
                        onErrorClick={
                            () => {Toast.fail(getFieldError('phone'),2);}
                         }
                    ></InputItem>
                    <InputItem
                        placeholder="请输入验证码"
                        extra={
                            <Button
                                type="primary"
                                disabled={this.state.isBtnSmsCodeDisabled}
                                size="small" inline
                                className="smsCode"
                            >
                                {this.state.btnSmsCodeText}
                            </Button>
                        }
                        onExtraClick={this.getCode}
                        {...getFieldProps('code', fieldProps['code'])}
                        error={!!getFieldError('code')}
                        onErrorClick={
                            () => {Toast.fail(getFieldError('code'),2);}
                         }
                    ></InputItem>
                </List>
                <div className="tipsText">
                    <img src={TipsLogo} alt=""/>
                    <div>
                        请使用E收款服务注册的手机号登录，收银员仅支持账号登录。
                    </div>
                </div>
                <WingBlank>
                    <Button className="login" type="primary" onTouchStart={this.submit}>登录</Button>
                </WingBlank>

            </div>
        )
    }
}

export default withRouter(createForm()(PhoneLoginForm))
