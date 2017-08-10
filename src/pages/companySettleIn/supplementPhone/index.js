import React from 'react';
import { Link, withRouter } from 'react-router'
import {
    Button, NavBar, Modal,
    Checkbox, Flex,List,
    InputItem, WhiteSpace,
    Picker,Toast,Card,Popup
} from 'antd-mobile';
import { axios, tools,ruleType } from 'UTILS';
import { createForm } from 'rc-form';
import './style.less'
import store from 'store';
import  GetCode from './getCode'
const AgreeItem = Checkbox.AgreeItem;


class SupplementPhone extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        tools.setDocumentTitle('补充手机号码');
        this.state = {
            clickTimes:0,
            agreeChecked: false,
            propsId: props.params.id,
            procecssCode: store.get('procecssCode'),
            modal2: false,
            cValue: [],
            bValue: [],

            //客户保存的数据
            reData:{},

            //rap获取
            newConnectTypes: [],
            newAgencyType: []
        }
        this.timer = null;
    }

    //首次
    componentWillMount() {
        //this.getConnectype();
        this.getAgencyType();
        this.init();
    }

    init() {
        console.log(this.state.propsId ,'nothing》')
        //重新审核
        if (this.state.propsId) {
            this.reChangeDatas();
            store.set('procecssId',this.state.propsId );
        }
        //返回
        if (this.state.procecssCode) {
            console.log(this.state.procecssCode,'流程编码')
            this.getBackDatas(this.state.procecssCode)
        }
    }

    //拿缓存
    getBackDatas(key) {
        console.log('开始拿缓存数据',key)
        //拿缓存的数据
        axios
            .get('/api/register/'+ key)
            .then(res=> {
                const customData = res.data || {};
                console.log(customData, '要你何用')
                 this.setState({
                     reData:customData,
                })
            })
            .catch(error=>{
                Toast.fail(`${error.message}`, 3);
            })
    }

    //重新审核
    reChangeDatas() {
        console.log('重新审核数据')
        //拿缓存的数据
        axios
            .get('/api/b/merchant/reaudit')
            .then(res=> {
                const customData = res.data || {};
                console.log(customData, '重新审核数据')
                this.setState({
                    reData:customData,
                })
            })
            .catch(error=>{
                Toast.fail(`${error.message}`, 3);
            })
    }



    // 获取所属机构
    getAgencyType() {
        //防止IE缓存
        const v = new Date().getTime();
        axios
            .get('/api/agencys?t='+v)
            .then(res=> {
                //转换数据格式
                const newAgencyType = res.data.map((item)=> {
                    return (
                    {
                        label: item.fullName,
                        value: item.agencyId,
                    }
                    )
                })
                this.setState({
                    newAgencyType
                })
            })
            .catch(error=>{
                Toast.fail(`${error.message}`, 3);
            })

    }

    //nav 返回上一步
    handleBackClick = () => {
        this.props.router.push(`/companyLogin`)
    };

    //打开验证码弹层 验证码内容
    openModal2 = () => {
        console.log("验证码弹层打开")
        this.setState({
            modal2: true
        })
    };

    //下一步
    nextStepClick = () => {

        this.props.form.validateFields((errors, value) => {
            if (errors) {
                 tools.showError(errors);
            } else {
                console.log('formdata::', value);

                let data={
                    phone:value.mobile,
                    password:value.password,           
                    id: store.get('procecssId'),
                }
                axios
                    .post(`/api/register/verifyphone`, data)
                    .then(res=> {
                        console.log("手机验证通过");
                        this.openModal2();

                        //axios
                        //    .get(`/api/register/verifycode/${value.mobile}`)
                        //    .then(res=>{
                        //        this.openModal2();
                        //    })
                        //    .catch(error=>{
                        //        Toast.fail('获取验证码失败，请重新获取', 2);
                        //    });


                    })
                    .catch(error=>{
                        Toast.fail(`${error.message}`, 3);
                    })
          };
        })
    }

    //关闭 验证码弹层
    closeGetCode = ()=> {
        this.setState({
            modal2: false
        })
    }



    render() {
        const newConnectTypes = this.state.newConnectTypes;
        const newAgencyType = this.state.newAgencyType;

        const { getFieldProps, getFieldValue, getFieldError } = this.props.form;
        const fieldProps = {
            mobile: {
                validateTrigger: 'onBlur',
                rules: [
                    {
                        required: true,
                        message: '手机号码不能为空'
                    },
                    ruleType('mobile')
//                  {
//                      pattern: /^13[0-9]{9}$|^147[0-9]{8}$|^15[0-9]{9}$|^17(0|7)[0-9]{8}$|^18[0-9]{9}$/,
//                      message: '手机号码格式不正确'
//                  },
                ],
                initialValue:this.state.reData.phone,
            },
            password:{
            	validateTrigger: 'onBlur',
            	rules: [
            	    {
                        required: true,
                        message: '密码不能为空'
                    },
                    {
                    	min:6,
                    	max:20,
                    	message: '仅输入6-20位'
                    },
                    ruleType('en-num')
                ],
                initialValue:this.state.reData.password,
            }

        };

        return (

            <div className="step-wrap">


                <header styleName="container header">为保障您的账号安全，请完善以下信息</header>
                <List
                    style={{ backgroundColor: 'white' }}
                    className="picker-list enterFs26"
                >       
           
                  {/*手机号码*/}
                    <InputItem
                        type="number"
                        placeholder="用于账号登录"
                        {...getFieldProps('mobile',
                            fieldProps['mobile'])}
                        error={!!getFieldError('mobile')}
                        onErrorClick={
                  () => {
                      Toast.fail(getFieldError('mobile'), 2);
                  }}
                    >
                        手机号码
                    </InputItem>
                    
                    
                      {/*登录密码*/}
                    <InputItem
                        type="password"
                        placeholder="6-20位大小写英文、数字"
                        {...getFieldProps('password',
                            fieldProps.password)}
                        error={!!getFieldError('fieldProps.password')}
                        onErrorClick={
                  () => {
                      Toast.fail(getFieldError('fieldProps.password'), 2);
                  }}
                    >
                        登录密码
                    </InputItem>

                </List>           

                {/*验证码弹层*/}
                <Modal
                    title=" "
                    transparent
                    maskClosable={false}
                    closable={false}
                    visible={this.state.modal2}
                    width={'100%'}
                    height={'90%'}
                >
                    <div>
                        <GetCode
                            formData={this.props.form.getFieldsValue()}
                            propsId={this.state.propsId}
                            procecssCode={this.state.procecssCode}
                            closeGetCode={this.closeGetCode}
                        />
                    </div>
                </Modal>

                <div styleName="btn-container">
                    <Button
                        className="stepBtn"
                        styleName="btn"
                        type="primary"
                        onClick={this.nextStepClick}
                        //disabled={!this.state.agreeChecked}
                    >下一步</Button>
                </div>
            </div>
        );
    }
}
export default createForm()(SupplementPhone);
