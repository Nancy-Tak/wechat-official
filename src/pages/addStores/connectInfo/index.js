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

class NewConnectInfo extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        tools.setDocumentTitle('添加门店');
        this.state = {
            agreeChecked: false,
            // propsId: props.params.id,
            propsId: this.props.location.query.id,
            procecssCode: store.get('procecssCode'),
            modal2: false,
            cValue: [],
            bValue: [],
            reData: {}, //客户保存的数据
            newConnectTypes: [], //rap获取
        }
        this.timer = null;
        console.log(this.state.procecssCode, "不同时间的pro")
    }

    //首次
    componentWillMount() {
        this.getConnectype();
        this.init();
    }

    init() {
        //重新审核
        console.log('id', this.state.propsId)
        if (this.state.propsId) {
            console.log('id', this.state.propsId)
            this.reChangeDatas(this.state.propsId);
            store.set('procecssId',this.state.propsId );
            // console.log(store.get('procecssId'),'waww')
        }
        //返回
        if (this.state.procecssCode) {
            console.log('流程编码', this.state.procecssCode)
            this.getBackDatas(this.state.procecssCode)
        }
    }

    getBackDatas(key) {
        //拿缓存的数据
        axios
            .get('/api/b/shop/reverseinfo/' + key)
            .then(res=> {
                const customData = res.data || {};
                console.log(customData, '要你何用')
                this.setState({
                    reData: customData,
                })
            })
            .catch(error=>{
                console.log(error,'error')
                Toast.fail(`${error.message}`, 3);
            })
    }

    reChangeDatas(key) {
        axios
            .get('/api/b/shop/reaudit/' + key )
            .then(res=> {
                const customData = res.data || {};
                console.log(customData, '要你何用')
                this.setState({
                    reData: customData,
                })
            })
            .catch(error=>{
                console.log(error,'error')
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
    }

    //nav 返回上一步
    handleBackClick = () => {
        this.props.router.push(`/companyPlatform/storeManagement`)
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
        //IdCard
        let IdCard = this.props.form.getFieldValue('IdCard');
        if (!tools.testIdCard(IdCard)) {
            return Toast.fail('请输入正确的身份证号码', 2);
        }
        this.props.form.validateFields((errors, value) => {
            if (errors) {
                tools.showError(errors);
            } else {
                console.log('formdata::', value);

                let data = {
                    phone: value.mobile,
                    id: store.get('procecssId')
                }
                axios
                    .post(`/api/b/shop/verifyphone`, data)
                    .then(res=> {
                        console.log("手机验证通过");
                   //     axios
                  //          .get(`/api/register/verifycode/${value.mobile}`)
                   //         .then(res=> {
                                this.openModal2();
                   //         })
                  //          .catch(error=> {
                  //              Toast.fail('获取验证码失败，请重新获取', 2);
                  //          });
                    })
            }
            ;
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
        let connectypeList = this.state.newConnectTypes;
        for (let i = 0; i < connectypeList.length; i++) {
            if (connectypeList[i].value == value) {
                connectorType = connectypeList[i].key;
            }
        }
        this.setState({
            cValue: value, connectorType
        });
    }


    // 阅读同意
    onAgreeChangeTest(e) {
        this.setState({
            agreeChecked: e.target.checked,
        });
    }

    render() {
        const newConnectTypes = this.state.newConnectTypes;

        const { getFieldProps, getFieldValue, getFieldError } = this.props.form;
        const fieldProps = {
            IdCard: {
                initialValue: this.state.bValue,
                validateTrigger: 'onBlur',
                rules: [
                    {
                        required: true,
                        message: '身份证号码不能为空'
                    },
                    ruleType('id-card')
//                  {
//                      pattern: /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/,
//                      message: '身份证号码格式不正确'
//                  },
                ],
                initialValue: this.state.reData.connectorIdCard,
            },
            connectType: {
                initialValue: this.state.reData.connectorType != null ? [this.state.reData.connectorType] : [],
                validateTrigger: 'onBlur',
                rules: [
                    {
                        required: true,
                        message: '联系人类型不能为空'
                    },
                    {
                        pattern: /^\S*$/,
                        message: '联系人类型不能为空'
                    }
                ],
                onChange: this.onConnectTypeChange
            },
            mobile: {
                validateTrigger: 'onBlur',
                rules: [
                    {
                        required: true,
                        message: '手机号码不能为空'
                    },
                    ruleType('mobile')
//                  {
//                  	pattern: /^13[0-9]{9}$|^147[0-9]{8}$|^15[0-9]{9}$|^17(0|7)[0-9]{8}$|^18[0-9]{9}$/,
//                  	message: '手机号码格式不正确'
//                  },
                ],
                initialValue: this.state.reData.phone,
            },
            users: {
                validateTrigger: 'onBlur',
                value: 'dfdfdf',
                rules: [
                    {
                        required: true,
                        message: '姓名不能为空'
                    }, {
                        min: 1,
                        max: 50,
                        message: '请输入1-50位字符'
                    },
                    ruleType('cn')
                    // {
                    //     pattern: /[\u4e00-\u9fa5]/,
                    //     message: '姓名只能是中文'
                    // },
                ],
                initialValue: this.state.reData.connector,
            },
            agree: {
                onChange: this.onAgreeChangeTest.bind(this)
            },
        };

        return (
            <div className="step-wrap">
                <header styleName="container header">为保障您的账号安全，请如实填写以下信息</header>
                <List
                    style={{ backgroundColor: 'white' }}
                    className="picker-list enterFs26"
                >
                    {/*姓名*/}
                    <InputItem
                        type='text'
                        placeholder="请输入姓名"
                        {...getFieldProps('users', fieldProps['users'])}
                        error={!!getFieldError('users')}
                        onErrorClick={
                            () => {
                                Toast.fail(getFieldError('users'), 2);
                            }}
                    >
                        姓名
                    </InputItem>

                    {/*联系人类型*/}
                    <Picker
                        data={newConnectTypes}
                        cols={1}
                        className="forss"
                        extra="请选择类型"
                        {...getFieldProps('connectType', fieldProps['connectType'])}

                    >
                        <List.Item arrow="horizontal">联系人类型</List.Item>
                    </Picker>
                    {/*身份证号码*/}
                    <InputItem
                        placeholder="请输入证件号"
                        type="IdCard"
                        {...getFieldProps('IdCard', fieldProps['IdCard'])}
                        error={!!getFieldError('IdCard')}
                        onErrorClick={
                            () => {
                                Toast.fail(getFieldError('IdCard'), 2);
                            }}
                    >
                        身份证号码
                    </InputItem>
                    <header styleName="container header">联系人手机号码非常重要，将用于账号登录、接收系统短信</header>
                    {/*手机号码*/}
                    <InputItem
                        type="number"
                        placeholder="请输入联系人手机号码"
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

                <div styleName="btn-container">
                    <Button
                        styleName="btn"
                        onClick={this.handleBackClick}
                    >返回上一步</Button>
                </div>
            </div>
        );
    }
}
export default createForm()(NewConnectInfo);
