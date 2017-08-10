import React from 'react';
import { withRouter } from 'react-router';
import {
    Icon, Button, InputItem,
    Toast,List,WingBlank
} from 'antd-mobile';
import { createForm } from 'rc-form';
import { axios, tools,ruleType } from 'UTILS';
import './verification.less';
import store from 'store';
// import {closeWindow} from 'weixin-js-sdk';

// import bgSuccess from 'ASSETS/images/login_success_bg.png';

class VerificationCode extends React.Component {
    constructor(props) {
        tools.setDocumentTitle('账号激活');
        super(props);
        let phone=this.props.location.query.phone;
        this.state={
            btnSmsCodeText:'获取验证码',
            isBtnSmsCodeDisabled:false,
            number:tools.hidenPhoneNumber(phone,3,4),
            isShowTip:'hidden'
        };
        this.timer=null;
    }

    countDown=()=>{
        console.log(this);
        let count=60;
        this.timer = setInterval(()=>{
            count--;
            if(count>0){
                this.setState({
                    btnSmsCodeText:`${count}秒重新获取`,
                    isBtnSmsCodeDisabled:true
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
    componentDidMount(){
        this.getVerifycode();
    }
    //离开时，清除定时器
    componentWillUnmount(){
        this.timer && clearInterval(this.timer);
        this.timer = false;
    }
    // 发送短信验证码
    getVerifycode(){
        if(this.state.isBtnSmsCodeDisabled) return;
        console.log('in get code..');
        axios.get(`/api/activate/verifycode`).then((res)=>{
            if(res.status == '1'){
                Toast.success('已发送短信',2);
                this.setState({
                    isShowTip:'visible'
                });
                this.countDown();
            }else{
                Toast.fail(`${res.message}`, 2);
            }
        }).catch(error=>{
            Toast.fail(error.message, 2);
        });
    }

    //提交短信验证码
    submit = () => {
        const { form,router } = this.props;
        form.validateFields((errors, value) => {
            if (errors) {
                tools.showError(errors);
            } else {
                let data={
                    code:value.code
                }
                axios.post(`/api/activate/verifycode/post`,data).then(res=>{
                    if(res.status == '1'){
                        router.push('/activate/success');
                    }else{
                        Toast.fail(`${res.message}`, 2);
                    }
                }).catch(error=>{
                    Toast.fail(error.message, 2);
                });
            }
        });
    }

    render() {
        const { number,isShowTip } = this.state;
        const { getFieldProps, getFieldError } = this.props.form;
        const fieldProps = {
            code:{
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

        return (
            <div className="verification-wrap">
                <div className="verification-title" style={{visibility:isShowTip}}>我们已经向&nbsp;<span>{number}</span>&nbsp;发送短信验证码，请查看短信并输入验证码</div>
                <WingBlank>
                <List>
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
                        onExtraClick={this.getVerifycode.bind(this)}
                        {...getFieldProps('code', fieldProps['code'])}
                        error={!!getFieldError('code')}
                        onErrorClick={
                            () => {Toast.fail(getFieldError('code'),2);}
                         }
                         type="number"
                    ></InputItem>
                </List>
                </WingBlank>

                <WingBlank>
                    <Button className="login" type="primary" onTouchStart={this.submit}>下一步</Button>
                </WingBlank>

            </div>
        );
    }
}

export default withRouter(createForm()(VerificationCode));




