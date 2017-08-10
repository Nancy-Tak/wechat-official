import React from 'react';
import { withRouter } from 'react-router'
import {
    Button, NavBar, Modal, Checkbox, Flex,List, InputItem, WhiteSpace,Picker,Toast
} from 'antd-mobile';
import { axios, tools } from 'UTILS';
import { createForm } from 'rc-form';
import './style.less';
import store from 'store';


class GetCode extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state={
            btnSmsCodeText:'获取验证码',
            isBtnSmsCodeDisabled:false,
        }
    }

    onChange = (val) => {
        console.log(val);
    }
    componentDidMount(){
        console.log('第一次进入..');
        this.getCode();
    }
    componentWillReceiveProps(nextProps){
        console.log('第二次进入..',nextProps);
        console.log('上一次de ..',this.props);
        //if(nextProps.formData.mobile != this.props.formData.mobile){
        //    this.timer && clearInterval(this.timer);
        //    this.timer = false;
        //    this.setState({
        //        btnSmsCodeText: '获取验证码',
        //        isBtnSmsCodeDisabled: false,
        //    });
        //}
        this.props=nextProps;
    }

    //获取验证码
    getCode=()=>{
        console.log('get smsCode..',this.props.form.getFieldValue('mobile'));

        if(this.state.isBtnSmsCodeDisabled) return;
        let mobile = this.props.formData.mobile;
        console.log(mobile,'手机号码')
        axios
            .get(`/api/register/verifycode/${mobile}`)
            .then(res=>{
                Toast.success('获取验证码成功', 2)
                this.countDown();
            })
            .catch(error=>{
                Toast.fail('获取验证码失败，请重新获取', 2);
            });
    }

    //定时器
    countDown=()=>{
        this.setState({
            isBtnSmsCodeDisabled:true,
            btnSmsCodeText: `60秒后重新获取`
        });

        var count=60;
        this.timer = setInterval(()=>{
            count--;
            if(count>0){
                this.setState({
                    isBtnSmsCodeDisabled: true,
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

    //   //离开时，清除定时器
    componentWillUnmount(){
        this.timer && clearInterval(this.timer);
        this.timer = false;
        console.log('离开页面,关闭定时器');
    }

    //提交验证码
    submit=()=>{
        this.props.form.validateFields((errors, value) => {
            let code= this.props.form.getFieldValue('code')
            if(!code) return Toast.info('请输入验证码',2);
            if(code.length != 6) return Toast.info('请输入正确6位验证码',2);
            //拿到父级填写的数据
            let procecssCode = this.props.procecssCode;
            let propsId = this.props.propsId;
            let formData = this.props.formData;
            axios
                .post(`/api/b/shop/save/contactor`,{
                    verifyCode:code,
                    connector:formData.users,
                    connectorIdCard:formData.IdCard,
                    phone:formData.mobile,
                    connectorType: formData.connectType[0],
                    id:store.get('procecssId'),
                    procecssCode:procecssCode,
                })
                .then(res=>{
                    console.log("成功拿到流程码了",res.data)
                    store.set('procecssCode',res.data.procecssCode);
                    this.props.router.push(`/newShopBasicInfo`)
                })
                .catch(error=>{
                    console.log(error,'error')
                    Toast.fail(`${error.message}`, 3);
                })
        });
    }

    //返回修改
    closeModal2=()=>{
        console.log('close modal2')
        // this.timer && clearInterval(this.timer);
        // this.timer = false;
        this.setState({
            btnSmsCodeText:'获取验证码',
            isBtnSmsCodeDisabled:false,
        })
        this.props.closeGetCode()
    }

    render() {
        const { getFieldProps, getFieldValue, getFieldError } = this.props.form;
        const fieldProps = {
            code: {
                validateTrigger: 'onBlur',
                rules: [
                    {
                        required: true,
                        message: '验证码不能为空'
                    }
                ]
            }
        };

        return (
            <div className="step-wrap">
                <div>
                    短信验证码将发送至您的手机，请耐心等待。1分钟后可重新获取验证码。                </div>
                <div styleName="smsCodeForm">
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
                        {...getFieldProps('code',fieldProps['code'])}
                    ></InputItem>
                </div>
                <div className="textAlignCenter">
                    <Button
                        className="stepBtn"
                        type="primary"
                        size="small"
                        inline
                        style={{ marginRight: '0.5rem' }}
                        onClick={this.submit}
                    >
                        确定
                    </Button>
                    <Button
                        className="stepBtn"
                        type="primary"
                        size="small"
                        inline
                        onClick={this.closeModal2}
                    >
                        返回修改
                    </Button>
                </div>
            </div>
        );
    }
}
export default withRouter(createForm()(GetCode))
