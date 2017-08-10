import React from 'react';
import { Link, withRouter } from 'react-router'
import {
    Button, NavBar, Modal, Checkbox, Flex,List, InputItem, WhiteSpace,Picker,Toast
} from 'antd-mobile';
import { axios, session,tools,ruleType } from 'UTILS';
import { createForm } from 'rc-form';
import './style.less'
import store from 'store'

class NewBalances extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        tools.setDocumentTitle('结算账户');
        this.state = {
            procecssCode:store.get('procecssCode') || null,

            isEdit:true,//开户名称能否编辑
            isEditPro:false,//所属省 能否编辑
            isEditPro:false,//所属省 能否编辑
            isEditBanks:false,//开户银行  能否编辑
            extraText:'请先输入银行账号',

            kValue: [],//开户银行的值
            bValue1:'',//分支 的值 3个
            bValue2:'',
            bValue3:'',
            bankAccountName:'',


            //分支行 市 名称显隐
            isBanksCity:false,
            isBanksName:false,

            //rap获取
            newBanks:[], //开户银行
            newBanksPro:[], //省 分支行
            newBanksCity:[],// 市 分支行
            newBanksName:[],//分支行

            //客户保存的数据
            reData:{},
        }
    }

    //首次
    componentWillMount() {
        this.getBanks();
        this.getBanksPro();
        this.init()
    }

    getBackDatas(key){
        axios
            .get('/api/b/shop/reverseinfo/'+ key)
            .then(res=>{
                const customData = res.data || {};

                this.props.form.setFieldsValue({
                    bankId:customData.bankId,
                    bankCityId:customData.bankCityId,
                    bankProvinceId:customData.bankProvinceId,
                    branchBankId:customData.branchBankId,

                    // bankCityName:customData.bankCityName,
                    // bankName:customData.bankName,
                    // bankProvinceName:customData.bankProvinceName,
                    // branchBankName:customData.branchBankName,
                })

                this.setState({
                    bankId:customData.bankId,
                    bankCityId:customData.bankCityId,
                    bankProvinceId:customData.bankProvinceId,
                    branchBankId:customData.branchBankId,

                    bankCityName:customData.bankCityName,
                    bankName:customData.bankName,
                    bankProvinceName:customData.bankProvinceName,
                    branchBankName:customData.branchBankName,

                })


                console.log(customData, 'new要你何用')
                this.getBanksCity(customData.bankProvinceId);
                this.getBanksName(customData.bankCityId)
                this.setState({
                    reData:customData,
                    bankAccountName:customData.bankAccountName,
                    bankAccountNo:customData.bankAccountNo,
                    kValue:customData.bankId,
                    bValue1:customData.bankProvinceId,
                    bValue2:customData.bankCityId,
                    bValue3:customData.branchBankId,
                })

                //是否显示市 和分支行
                console.log(customData.branchBankName,'whter')
                if(customData.branchBankName){
                    this.setState({
                        isBanksName:true,
                        isBanksCity:true,
                        isEditPro:true,
                        isEditBanks:true,
                    })
                }

                //开户名称能否编辑
                if(customData.companyType==1){
                    this.setState({
                        isEdit:false,
                    })
                }
            })
            .catch(error=>{
            Toast.fail(`${error.message}`, 3);
        })
    }

    init(){
        console.log(this.state.procecssCode,'流程')
        if (this.state.procecssCode) {
            this.getBackDatas(this.state.procecssCode)
        }
    }

    //上一步
    handleBackClick = () => {
        this.props.router.push(`/newShopBasicInfo`)
    };
    onChange = (val) => {
        console.log(val);
    }

    //下一步
    nextStepClick = ( ) => {
        // 获取表单资料
        console.log('收到表单值:', this.props.form.getFieldsValue());
        this.props.form.validateFields((errors, value) => {
            if (errors) {
                //Toast.fail('请输入完整信息', 2);
                tools.showError(errors);
            } else {
                console.log(value,"表单无误")
                console.log('bankId',this.state.bankId, 'cityId',this.state.bankCityId,'proId',this.state.bankProvinceId,'branchBankId',this.state.branchBankId)
                // bankAccountName	开户名称	string
                // bankAccountNo	银行账号	string
                // bankCityId	开户银行市ID	string
                // bankCityName	开户银行市名称	string
                // bankId	开户银行ID	string
                // bankName	开户银行名称	string
                // bankProvinceId	开户银行省ID	string
                // bankProvinceName	开户银行省名	string
                // branchBankId	开户分支行ID	string
                // branchBankName	开户分支行名称	string
                // procecssCode
                axios
                    .post(`/api/b/shop/save`,{
                        bankAccountName:value.bankAccountName,
                        bankAccountNo:value.bankAccountNo,
                        bankCityId:this.state.bankCityId ,
                        bankCityName:this.state.bankCityName,
                        bankId:this.state.bankId,
                        // bankName:value.bankName[0],
                        bankName:this.state.bankName,
                        bankProvinceId:this.state.bankProvinceId ,
                        // bankProvinceName:value.bankProvinceName[0],
                        bankProvinceName:this.state.bankProvinceName,
                        branchBankId: this.state.branchBankId,
                        // branchBankName:value.branchBankName[0],
                        branchBankName:this.state.branchBankName,
                        procecssCode:this.state.procecssCode,
                        // bankAccountName:value.bankAccountName,
                        // bankAccountNo:value.bankAccountNo,
                        // bankCityId:this.state.bankCityId ,
                        // bankCityName:this.state.bankCityName,
                        // bankId:this.state.bankId,
                        // bankName:this.state.bankName,
                        // bankProvinceId:this.state.bankProvinceId ,
                        // bankProvinceName:this.state.bankProvinceName,
                        // branchBankId: this.state.branchBankId,
                        // branchBankName:this.state.branchBankName,
                        // procecssCode:this.state.procecssCode,
                    })
                    .then(res=>{
                        console.log('message',res.message ,res.status ,'res.status')
                        this.props.router.push(`/newResultPage?status=${res.status}&message=${res.message}`)
                    })
                    .catch(error=>{
                        console.log(error,'error')
                        Toast.fail(`${error.message}`, 3);
                    })
            };
        })
    }

    //获取开户银行
    getBanks(){
        //防止IE缓存
        const v = new Date().getTime();
        axios
            .get('/api/bank/info/1?t='+ v)
            .then(res=>{
                console.log(res.data,"开户银行基本数据")
                //开户银行 转换数据格式
                const newBanks = res.data.map((item)=>{
                    return (
                    {
                        label:item.BankName,
                        value:item.B_BankID
                    }
                    )
                })
                this.setState({
                    newBanks,
                })
            })
            .catch(error=>{
                Toast.fail(`${error.message}`, 3);
            })
    }
    //获取省 分支行
    getBanksPro(){
        axios
            .get('/api/bank/area/0')
            .then(res=>{
                console.log("省 分支行数据成功", res.data)
                //转换数据格式 渲染
                const newBanksPro = res.data.map((item)=>{
                    return (
                    {
                        label:item.AreaName,
                        value:item.B_BankAreaID
                    }
                    )
                })
                this.setState({
                    newBanksPro,
                })
            })
            .catch(error=>{
                Toast.fail(`${error.message}`, 3);
            })
    }
    //获取市 分支行
    getBanksCity(v){
        axios
            .get('/api/bank/area/'+ v )
            .then(res=>{
                console.log("市 分支行数据成功", res.data)
                //转换数据格式 渲染
                const newBanksCity = res.data.map((item)=>{
                    return (
                    {
                        label:item.AreaName,
                        value:item.B_BankAreaID
                    }
                    )
                })
                this.setState({
                    newBanksCity,
                })
            })
            .catch(error=>{
                Toast.fail(`${error.message}`, 3);
            })
    }
    //获取分支行 名称
    getBanksName(v){
        console.log('v',v,'bankName',this.state.bankName,'bankId',this.state.bankId)
        axios
            .get('/api/bank/branch/'+ v +"/" + this.state.bankId)
            .then(res=>{
                //转换数据格式
                const newBanksName = res.data.map((item)=>{
                    return (
                    {
                        label:item.BranchBankName,
                        value:item.B_BranchBankID
                    }
                    )
                })
                this.setState({
                    newBanksName,
                    // isBanksName:true,
                })
            })
            .catch(error=>{
                Toast.fail(`${error.message}`, 3);
            })
    }
    //开户银行
    onBankNameChange = (value)=> {
        console.log('开户银行:',value);
        let bankName = null;
        let bankId = null;
        let banksList=this.state.newBanks;
        for(let i=0;i<banksList.length;i++){
            if(banksList[i].value==value){
                bankName=banksList[i].label;
                bankId = banksList[i].value;

                this.props.form.setFieldsValue({
                    bankName:[],
                    bankProvinceName:[],
                    bankCityName:[],
                    branchBankName:[],
                })
            }
        }
        this.setState({
            bankId,
            bankName,
            isBanksCity:false,
            isBanksName:false,
        });
    }
    //省
    onBankProvinceNameChange = (value)=> {
        console.log("onBankProvinceNameChange",value)
        let bankProvinceName = null;
        let bankProvinceId = null;
        let banksProList=this.state.newBanksPro;
        for(let i=0;i<banksProList.length;i++){
            if(banksProList[i].value==value[0]){
                bankProvinceName=banksProList[i].label;
                bankProvinceId=banksProList[i].value;
            }
        }
        this.props.form.setFieldsValue({
            bankCityName:[],
            branchBankName:[],
        });
        this.setState({
            bankProvinceName,
            bankProvinceId,
            isBanksCity:true,
            isBanksName:false,
        });
        this.getBanksCity(value[0])
    }
    //市
    onBankCityNameChange = (value)=> {
        let bankCityName = null;
        let bankCityId = null;
        let banksCityList=this.state.newBanksCity;
        for(let i=0;i<banksCityList.length;i++){
            if(banksCityList[i].value==value[0]){
                bankCityName=banksCityList[i].label;
                bankCityId=banksCityList[i].value;

                this.props.form.setFieldsValue({
                    branchBankName:[],
                    bankCityName,
                    bankCityId,
                })
            }
        }

        this.setState({
            bankCityName,
            bankCityId,
            isBanksName:true,
        });
        this.getBanksName(value[0])
    }
    //分支行
    onBranchBankNameChange = (value)=> {
        let branchBankName = null;
        let branchBankId = null;
        let branchBankList=this.state.newBanksName;
        for(let i=0;i<branchBankList.length;i++){
            if(branchBankList[i].value==value[0]){
                branchBankName=branchBankList[i].label;
                branchBankId=branchBankList[i].value;
            }
        }
        this.setState({
            branchBankName,branchBankId
        });
    }
    check=(value)=>{
        if(value.length >= 5){
            this.setState({
                isEditBanks:true,
                isEditPro:true,
                extraText:"",
            })
            axios
                .get(`/api/bank/infobycard/`+ value)
                .then(res=>{
                    console.log(res.data)
                    if(res.data){
                        console.log('匹配的银行卡开户行=》',res.data)
                        // this.state.newBanks.map(item=>{
                        //     if( res.data.BankCode == item.value){
                        //         //匹配到，就改变bankName ,id
                        //         this.props.form.setFieldsValue({
                        //             bankId:item.value,
                        //             bankName:[item.value, item.label],
                        //         })
                        //         this.setState({
                        //             bankId:item.value,
                        //             bankName:[item.label, item.value],
                        //         })
                        //     }
                        // })
                        this.props.form.setFieldsValue({
                            bankName:[res.data.BankCode]
                        });
                        this.setState({
                            bankId:res.data.BankCode,
                            bankName:res.data.BankName
                        })
                    }
                })
                .catch(error=>{
                    Toast.fail(`${error.message}`, 3);
                })
        } else {
            //清空数据，bankName也空了
            this.props.form.setFieldsValue({
                bankName:[],
                bankProvinceName:[],
                bankCityName:[],
                branchBankName:[],
            })
            this.setState({
                //不能编辑
                isEditBanks:false,
                isEditPro:false,
                //提示更改
                extraText:'请先输入银行账号',
                //不显示
                isBanksCity:false,
                isBanksName:false,
            })
        }
    }

    render() {
        const newBanks = this.state.newBanks;
        const newBanksPro = this.state.newBanksPro;
        const newBanksCity = this.state.newBanksCity;
        const newBanksCityName = this.state.newBanksName;

        const { getFieldProps, getFieldValue, getFieldError } = this.props.form;
        const fieldProps = {
            bankAccountName: {
                validateTrigger: 'onBlur',
                rules: [
                    {
                        required: true,
                        message: '开户名称不能为空'
                    },
                    {
                        min:1,
                        max:50,
                        message:'请输入1-50位字符'
                    }
                ],
                initialValue:this.state.bankAccountName,
            },

            bankAccountNo: {
                validateTrigger: 'onBlur',
                rules: [
                    {
                        required: true,
                        message: '银行账号不能为空'
                    },{
                        min:5,
                        max:30,
                        message: '银行卡账号请输入5-30位数字'
                    },
                      ruleType('bank-card'),
                    // {
                    //     pattern: /^\d{5,30}$/,
                    //     message: '请输入正确的银行账号'
                    // },
                ],
                initialValue:this.state.bankAccountNo,
                onChange: this.check
            },

            bankName: {
                validateTrigger: 'onBlur',
                initialValue:this.state.kValue ? [this.state.kValue] : [],
                rules: [
                    {
                        required: true,
                        message: '开户银行不能为空'
                    },
                    {
                        pattern: /^\S*$/,
                        message: '开户银行不能为空'
                    }
                ],
                onChange: this.onBankNameChange
            },

            bankProvinceName: {
                validateTrigger: 'onBlur',
                initialValue:this.state.reData.bankProvinceId ? [this.state.reData.bankProvinceId] : [],
                // initialValue:this.state.bValue1 ? [this.state.bValue1] : [],
                rules: [
                    {
                        required: true,
                        message: '所属省不能为空'
                    },
                    // {
                    //     pattern: /^\S*$/,
                    //     message: '所属省不能为空'
                    // }
                ],
                onChange: this.onBankProvinceNameChange
            },

            bankCityName: {
                validateTrigger: 'onBlur',
                //initialValue:this.state.reData.bankCityId ? [this.state.reData.bankCityId] : [],
                initialValue:this.state.bValue2 ? [this.state.bValue2] : [],
                rules: [
                    {
                        required: true,
                        message: '所属市不能为空'
                    },
                    // {
                    //     pattern: /^\S*$/,
                    //     message: '所属市不能为空'
                    // }
                ],
                onChange: this.onBankCityNameChange
            },

            branchBankName: {
                validateTrigger: 'onBlur',
                //initialValue:this.state.reData.branchBankId ? [this.state.reData.branchBankId] : [],
                initialValue:this.state.bValue3 ? [this.state.bValue3] : [],
                rules: [
                    {
                        required: true,
                        message: '分支行不能为空'
                    },
                    // {
                    //     pattern: /^\S*$/,
                    //     message: '分支行不能为空'
                    // }
                ],
                onChange: this.onBranchBankNameChange
            },
        };
        return (
            <div className="step-wrap">
                <header styleName="container header">基本信息</header>
                <List
                    style={{ backgroundColor: 'white' }} className="picker-list enterFs26"
                >

                    {/*开户名称*/}
                    <InputItem
                        type="text"
                        placeholder=""
                        {...getFieldProps('bankAccountName',
                            fieldProps['bankAccountName'])}
                        error={!!getFieldError('bankAccountName')}
                        onErrorClick={
                                () => {
                                    Toast.fail(getFieldError('bankAccountName'), 2);
                                }}
                    >
                        开户名称
                    </InputItem>
                    {/*this.state.isEdit ?
                        <InputItem
                            type="text"
                            placeholder=""
                            {...getFieldProps('bankAccountName',
                                fieldProps['bankAccountName'])}
                            error={!!getFieldError('bankAccountName')}
                            onErrorClick={
                                () => {
                                    Toast.fail(getFieldError('bankAccountName'), 2);
                                }}
                        >
                            开户名称
                        </InputItem>
                        :
                        <InputItem
                            type="text"
                            placeholder=""
                            disabled
                            {...getFieldProps('bankAccountName',
                                fieldProps['bankAccountName'])}
                            error={!!getFieldError('bankAccountName')}
                            onErrorClick={
                                () => {
                                    Toast.fail(getFieldError('bankAccountName'), 2);
                                }}
                        >
                            开户名称
                        </InputItem>*/}



                    {/*银行账号*/}
                    <InputItem
                        type="number" // bankCard,phone,password,number,text
                        placeholder=" "
                        {...getFieldProps('bankAccountNo',
                            fieldProps['bankAccountNo'])}

                        error={!!getFieldError('bankAccountNo')}
                        onErrorClick={
                            () => {
                                Toast.fail(getFieldError('bankAccountNo'), 2);
                            }}
                    >
                        银行账号
                    </InputItem>

                    {/*开户银行*/}
                    <Picker
                        data={newBanks}
                        cols={1}
                        className="forss"
                        extra={this.state.extraText}
                        disabled={!this.state.isEditBanks}  //不能编辑
                        {...getFieldProps('bankName', fieldProps['bankName'])}
                    >
                        <List.Item arrow="horizontal">开户银行</List.Item>
                    </Picker>

                    {/*省 分支行*/}
                    <Picker
                        data={newBanksPro}
                        cols={1}
                        className="forss"
                        extra={this.state.extraText}
                        disabled ={!this.state.isEditPro}//不能编辑
                        {...getFieldProps('bankProvinceName', fieldProps['bankProvinceName'])}
                    >
                        <List.Item arrow="horizontal">分支行(所属省)</List.Item>
                    </Picker>

                    {/*市 分支行*/}
                    {this.state.isBanksCity ?
                        <Picker
                            data={newBanksCity}
                            cols={1}
                            className="forss"
                            extra=" "
                            {...getFieldProps('bankCityName', fieldProps['bankCityName'])}
                        >
                            <List.Item arrow="horizontal">分支行(所属市)</List.Item>
                        </Picker>
                        : null
                    }

                    {/*分支行 名称*/}
                    {this.state.isBanksName ?
                        <Picker
                            data={newBanksCityName}
                            cols={1}
                            className="forss"
                            extra=" "
                            {...getFieldProps('branchBankName', fieldProps['branchBankName'])}
                        >
                            <List.Item arrow="horizontal">分支行</List.Item>
                        </Picker>
                        : null
                    }
                </List>

                <WhiteSpace size="xl" />

                <div styleName="btn-container">
                    <Button className ='stepBtn' styleName="btn" type="primary" onClick={this.nextStepClick}>下一步</Button>
                </div>

                <div styleName="btn-container">
                    <Button styleName="btn" onClick={this.handleBackClick} >上一步</Button>
                </div>
            </div>
        );
    }
}
export default createForm()(NewBalances);
