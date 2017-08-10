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


class SupplementUser extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        tools.setDocumentTitle('商户入驻');
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
        console.log(this.state.procecssCode, "不同时间的pro")
    }

    //首次
    componentWillMount() {
        this.getConnectype();
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

    //获取联系人类型
    getConnectype() {
        //防止IE缓存
        const v = new Date().getTime();
        axios
            .get('/api/enum/contactortypes?t=' + v)
            .then(res=> {
                //转换数据格式
                const newConnectTypes = res.data.map((item)=> {
                    return (
                    {
                        label: item.text,
                        value: item.code,
                    }
                    )
                })
                this.setState({
                    newConnectTypes,
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
        // //IdCard
        // let IdCard=this.props.form.getFieldValue('IdCard');
        // if(!tools.testIdCard(IdCard)){
        //     return Toast.fail('请输入正确的身份证号码',2);
        // }
        this.props.form.validateFields((errors, value) => {
            if (errors) {
                 tools.showError(errors);
            } else {
                console.log('formdata::', value);

                let data={
                    // phone:value.mobile,
                    // agencyId:value.bank[0],
                    // id: store.get('procecssId'),
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

    onConnectTypeChange = (value)=> {
        let connectorType = null;
        let connectypeList=this.state.newConnectTypes;
        for(let i=0;i<connectypeList.length;i++){
            if(connectypeList[i].value==value){
                connectorType=connectypeList[i].key;
            }
        }
        this.setState({
            cValue: value,connectorType
        });
    }

    onBankChange = (value)=> {
        let agencyId = null;
        let agencyList=this.state.newAgencyType;
        for(let i=0;i<agencyList.length;i++){
            if(agencyList[i].value==value){
                agencyId=agencyList[i].key;
            }
        }
        this.setState({bValue: value,agencyId});
    }


    // 用户须知模态框显示
    showModalTest = (e) => {
        // 现象：如果弹出的弹框上的 x 按钮的位置、和手指点击 button 时所在的位置「重叠」起来，
        // 会触发 x 按钮的点击事件而导致关闭弹框 (注：弹框上的取消/确定等按钮遇到同样情况也会如此)
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
            visibleTest: true,
        });
    }

    // 用户须知 取消
    onCloseTest = () => {
        this.setState({
            visibleTest: false,
        });
    }

    // 用户须知 确认
    onAgreeTest = () => {
        this.setState({
            agreeChecked: true,
            visibleTest: false,
        });
    }

    // 阅读同意
     onAgreeChangeTest(e) {
       this.setState({
             agreeChecked :e.target.checked,
        });
      }

    checkEvenClick=()=>{
        this.setState({
            clickTimes:this.state.clickTimes+1,
        })
        console.log('clickTimes',this.state.clickTimes)
        if(this.state.clickTimes==9){
            var  newAgencyType = this.state.newAgencyType;
            const list =[
                     {
                         label: '招商银行深圳分行',
                         value: '294526569337450496',
                     }
            ]
            console.log('add test data' ,list)
            this.setState({
                newAgencyType: [...newAgencyType, ...list],
            });
            console.log('you can choose test data now')
        }
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
                ],
              //  initialValue:this.state.reData.phone,
            },
            users: {
                validateTrigger: 'onBlur',
                rules: [
                    {
                        required: true,
                        message: '登录名不能为空'
                    },{
                        min:1,
                        max:50,
                        message: '请输入1-50位字符'
                    },
                    ruleType('cn')
                ],
               // initialValue: this.state.reData.connector,
            },

            password: {
                //initialValue:this.state.bValue,
                validateTrigger: 'onBlur',
                rules: [
                    {
                        required: true,
                        message: '密码不能为空'
                    },
                    {
                        min:6,
                        max:20,
                        message:'密码格式有误'
                    }
                ]
            }
        };

        return (

            <div className="step-wrap">

                <header styleName="container header">为保障您的账号安全，请如实填写以下信息</header>
                <List
                    style={{ backgroundColor: 'white' }}
                    className="picker-list enterFs26"
                >
                    {/*手机号码*/}
                    <InputItem
                        type="number"
                        placeholder="已授权登录的手机号码"
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

                    {/*登录名*/}
                    <InputItem
                        type='text'
                        placeholder="用于账号登录"
                        {...getFieldProps('users', fieldProps['users'])}
                        error={!!getFieldError('users')}
                        onErrorClick={
                    () => {
                        Toast.fail(getFieldError('users'), 2);
                    }}
                        //onClick={this.checkEvenClick}
                        onTouchStart={this.checkEvenClick}
                    >
                        登录名
                    </InputItem>

                    {/*登录密码*/}
                    <InputItem
                        placeholder="6-20位大小写英文、数字"
                        {...getFieldProps('password', fieldProps['password'])}
                        error={!!getFieldError('password')}
                        type="password"
                        onErrorClick={
                            () => {Toast.fail(getFieldError('password'),2);}
                        }
                    >登录密码</InputItem>

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
                    >下一步</Button>
                </div>

                <div styleName="btn-container" style={{display:'none'}}>
                    <Button
                        styleName="btn"
                        onClick={this.handleBackClick}
                    >返回上一步</Button>
                </div>

            </div>
        );
    }
}
export default createForm()(SupplementUser);
