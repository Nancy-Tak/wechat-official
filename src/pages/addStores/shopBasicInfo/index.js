import React from 'react';
import { Link, withRouter } from 'react-router'
import {
    Button, NavBar, Modal, Checkbox, Flex,List, InputItem, WhiteSpace,Picker,Toast
} from 'antd-mobile';
import { axios, session,tools,ruleType } from 'UTILS';
import { createForm } from 'rc-form';
import './style.less'
import  AddBusinessAdd from './addBusinessAdd'
import store from 'store'

class NewShopBasicInfo extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        tools.setDocumentTitle('门店基本资料');
        this.state = {
            procecssCode: store.get('procecssCode') || null,
            //默认值
            zValue: [],
            jValue1: [],
            jValue2: [],
            modal1: false, //地址弹层

            //rap获取
            newLicensetypes: [], //证件类型
            newIndustry: [], //经营类目
            newIndustry2: [],// 二级经营类目

            //客户保存的数据
            reData: {},
            storeAddress: '',
            address: '',
        }
    }

    //首次
    componentWillMount() {
        this.getLicense();
        this.getinduType();
        this.init()
    }

    init() {
        if (this.state.procecssCode) {
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
                    zValue:customData.licenseType,
                    address: `${customData.provinceName || ''}${customData.cityName || ''}${customData.areaName || ''}${customData.address || ''}`,
                    areaId:customData.areaId,
                    smallAddress:customData.address
                })
                // if (customData.topIndustryId) {
                //     this.getTwoAgen(customData.topIndustryId)
                // }
                // console.log(this.state.reData.licenseType ,'reData.licenseType')
            })
            .catch(error=>{
                console.log(error,'error')
                Toast.fail(`${error.message}`, 3);
            })
    }

    //获取证件类型
    getLicense() {
        axios
            .get('/api/enum/licensetypes')
            .then(res=> {
                console.log(res.data, "证件类型基本数据")
                //开户银行 转换数据格式
                const newLicensetypes = res.data.map((item)=> {
                    return ({
                        label: item.text,
                        value: item.code
                    })
                })
                this.setState({
                    newLicensetypes,
                })
            })
    }

    //获取经营类目
    getinduType() {
        axios
            .get('/api/industry/1')
            .then(res=> {
                console.log(res.data, '一级经营类目 数据');
                    const data = res.data[0]
                store.set('topId',data.id);
                this.getTwoAgen(data.id)
            })
    }

    //获取二级经营类目
    getTwoAgen(v) {
        axios
            .get('/api/industry/' + v)
            .then(res=> {
                console.log("二级经营类目", res.data)
                //转换数据格式
                const newIndustry2 = res.data.map((item)=> {
                    return (
                    {
                        label: item.name,
                        value: item.id
                    }
                    )
                })
                this.setState({
                    newIndustry2,
                    isTwoAgen: true,
                })
            })
    }

    //上一步
    handleBackClick = () => {
        this.props.router.push(`/newConnectInfo`)
    };
    onChange = (val) => {
        console.log(val);
    }
    //下一步
    nextStepClick = () => {
        // 获取表单资料
        this.props.form.validateFields((errors, value) => {
            console.log('formdata:',value);
            if (errors) {
                tools.showError(errors);
            } else {
                let address=this.state.address;
                if(!address)  return Toast.fail('请选择经营地址',3);
                let data = {
                    address: this.state.smallAddress,
                    areaId: this.state.areaId,
                    customerServicePhone: value.customerServicePhone,
                    //industryId: value.industryId[0],
                    licenseNo: value.licenseNo,
                    licenseType: value.licenseType[0],
                    name: value.name,
                    simpleName: value.simpleName,
                    topIndustryId: store.get('topId'),
                    procecssCode: this.state.procecssCode
                }
                axios
                    .post(`/api/b/shop/save`, data)
                    .then(res=> {
                        console.log('message',res.message ,res.status ,'res.status')
                        this.props.router.push(`/newResultPage?status=${res.status}&message=${res.message}`)
                        // this.props.router.push(`/newBalances`)
                        store.remove('address');
                    })
                    .catch(errors=>{
                        Toast.fail(`${errors.message}`);
                    });
            }
            ;
        })
    }
    //打开编辑地址的弹层
    openAddModal = ()=> {
        this.setState({
            modal1: true
        })
    }
    //关闭编辑地址的弹层
    closeM = ()=> {
        this.setState({
            modal1: false
        })
        // 拿到本地缓存的地址
        let Address = store.get('address')
        let ProText = store.get('ProText')
        let CityText = store.get('CityText')
        let AreaText = store.get('AreaText')
        this.setState({
            storeAddress: Address,
            address: ProText.ProText + CityText.CityText + AreaText.AreaText + Address.fullName,
            areaId:store.get('address').area,
            smallAddress:store.get('address').fullName
        })
    }
    //证件类型
    onLicenseTypeChange = (value)=> {

        let LicenseType = null;
        let LicenseList = this.state.newLicensetypes;
        for (let i = 0; i < LicenseList.length; i++) {
            if (LicenseList[i].value == value) {
                LicenseType = LicenseList[i].key;
            }
        }
        this.setState({
            zValue: value,
            LicenseType
        });
    }

    //经营类目
    onIndustryTypeTwoChange = (value)=> {
        this.setState({
            jValue2: value
        });
    }

    render() {
        const newLicensetypes = this.state.newLicensetypes;
        const newIndustry2 = this.state.newIndustry2;

        const { getFieldProps, getFieldValue, getFieldError } = this.props.form;
        const fieldProps = {
            simpleName: {
                validateTrigger: 'onBlur',
                rules: [
                    {
                        required: true,
                        message: '门店简称不能为空'
                    },{
                        min:1,
                        max:15,
                        message:'门店简称不能超过15个字符'
                    },
                    // {
                    //   pattern: /[\u4e00-\u9fa5]/,
                    //  message: '门店简称只能是中文'
                    //  },
                ],
                initialValue: this.state.reData.simpleName
            },
            name: {
                validateTrigger: 'onBlur',
                rules: [
                    {
                        required: true,
                        message: '门店名称不能为空'
                    },{
                        min:1,
                        max:15,
                        message:'门店名称不能超过15个字符'
                    },
                ],
                initialValue: this.state.reData.name
            },
            customerServicePhone: {
                validateTrigger: 'onBlur',
                rules: [
                    {
                        required: true,
                        message: '客服电话不能为空'
                    },
                    {
                        min:1,
                        max:50,
                        message:'请输入1-50位字符'
                    },
                 {
                     pattern: /^[\d\-]+$/,
                     message: '客服电话格式不正确'
                 },
                ],
                initialValue: this.state.reData.customerServicePhone
            },
            licenseNo: {
                validateTrigger: 'onBlur',
                rules: [
                    {
                        required: true,
                        message: '证件号码不能为空'
                    },
                    {
                        min: 1,
                        max: 50,
                        message: '请输入1-50位字符'
                    },
                    ruleType('num+all'),
                ],
                initialValue: this.state.reData.licenseNo
            },
            address: {
                validateTrigger: 'onBlur',
                rules: [
                    {
                        required: true,
                        message: '经营地址不能为空'
                    },
                    ruleType('cn+all')
                    // {
                    //  pattern: /[\u4e00-\u9fa5]/,
                    //  message: '经营地址只能是中文'
                    //  },
                ],
                 //initialValue: store.get('address').fullName
            },
            //证件类型
            licenseType: {
                validateTrigger: 'onBlur',
                initialValue: this.state.reData.licenseType != null ? [this.state.reData.licenseType] : [],
                rules: [
                    {
                        required: true,
                        message: '证件类型不能为空'
                    },
                    // {
                    //     pattern: /^\S*$/,
                    //     message: '证件类型不能为空'
                    // }
                ],
                onChange: this.onLicenseTypeChange
            },
            //经营类目
            //industryId: {
            //    validateTrigger: 'onBlur',
            //    initialValue: this.state.reData.industryId ? [this.state.reData.industryId] : [],
            //    rules: [
            //        {
            //            required: true,
            //            message: '经营类目不能为空'
            //        },
            //        // {
            //        //     pattern: /^\S*$/,
            //        //     message: '联系人类型不能为空'
            //        // }
            //    ],
            //    onChange: this.onIndustryTypeTwoChange
            //},
        };
        return (
            <div className="step-wrap">
                <header styleName="container header">基本信息</header>
                <List
                    style={{ backgroundColor: 'white' }} className="picker-list enterFs26"
                >
                    {/*门店简称*/}
                    <InputItem
                        type="text"
                        placeholder="客户支付时显示的收款人名称"
                        {...getFieldProps('simpleName',
                            fieldProps['simpleName'])}
                        error={!!getFieldError('simpleName')}
                        onErrorClick={
                            () => {
                                Toast.fail(getFieldError('simpleName'), 2);
                            }}
                    >
                        门店简称
                    </InputItem>

                    {/*客服电话*/}
                    <InputItem
                        type="text"
                        placeholder="客户支付页面显示"
                        {...getFieldProps('customerServicePhone',
                            fieldProps['customerServicePhone'])}
                        error={!!getFieldError('customerServicePhone')}
                        onErrorClick={
                            () => {
                                Toast.fail(getFieldError('customerServicePhone'), 2);
                            }}
                    >
                        客服电话
                    </InputItem>
                </List>

                <header styleName="container header">证件信息 以下信息须与证件信息保持一致</header>
                <List
                    style={{ backgroundColor: 'white' }} className="picker-list enterFs26"
                >
                    {/*门店*/}
                    <InputItem
                        type="text"
                        {...getFieldProps('name',
                            fieldProps['name'])}
                        error={!!getFieldError('name')}
                        onErrorClick={
                            () => {
                                Toast.fail(getFieldError('name'), 2);
                            }}
                    >
                        门店名称
                    </InputItem>

                    {/*证件类型*/}
                    <Picker
                        data={newLicensetypes}
                        cols={1}
                        className="forss"
                        extra=" "
                        {...getFieldProps('licenseType', fieldProps['licenseType'])}
                    >
                        <List.Item arrow="horizontal">证件类型</List.Item>
                    </Picker>

                    {/*证件号码*/}
                    <InputItem
                        type="text"
                        {...getFieldProps('licenseNo',
                            fieldProps['licenseNo'])}
                        error={!!getFieldError('licenseNo')}
                        onErrorClick={
                            () => {
                                Toast.fail(getFieldError('licenseNo'), 2);
                            }}
                    >
                        证件号码
                    </InputItem>

                    {/*经营类目*/}
                    {/*
                        <Picker
                            data={newIndustry2}
                            cols={1}
                            className="forss"
                            extra=" "
                            {...getFieldProps('industryId', fieldProps['industryId'])}
                        >
                            <List.Item arrow="horizontal">经营类目</List.Item>
                        </Picker>
                     */}

                    {/*经营地址*/}
                    <InputItem
                        type="text"
                        onClick={this.openAddModal}
                        value={this.state.address}
                     >
                        经营地址
                    </InputItem>

                </List>

                {/*编辑 经营地址 弹层*/}
                <Modal
                    title=""
                    transparent
                    maskClosable={false}
                    closable={false}
                    visible={this.state.modal1}
                    width={'100%'}
                    height={'100%'}
                    style={{backgroundColor:'#EFEFF4',paddingTop:'30px'}}
                >
                    <div>
                        <AddBusinessAdd closeM={this.closeM}/>
                    </div>
                </Modal>

                <WhiteSpace size="xl"/>

                <div styleName="btn-container">
                    {/*<Button className="stepBtn" styleName="btn" type="primary" onClick={this.nextStepClick}>下一步</Button>*/}
                    <Button className="stepBtn" styleName="btn" type="primary" onClick={this.nextStepClick}>提交</Button>
                </div>

                <div styleName="btn-container">
                    <Button styleName="btn" onClick={this.handleBackClick}>上一步</Button>
                </div>
            </div>
        );
    }
}
export default createForm()(NewShopBasicInfo);
