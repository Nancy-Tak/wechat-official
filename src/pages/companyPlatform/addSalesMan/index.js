import React from 'react';
import { withRouter } from 'react-router';
import {
    Button, NavBar, Modal,
    Checkbox, Flex,List,
    InputItem, WhiteSpace,
    Picker,Toast,Card,Popup,Switch
} from 'antd-mobile';
import { axios, tools,ruleType } from 'UTILS';
import './style.less';
import { createForm } from 'rc-form';
import store from 'store'

class AddSalesMan extends React.Component{
    constructor(props) {
        super(props);
        tools.setDocumentTitle('添加店员');
        this.state = {
            checkOn:true, //提醒开关
            shopsVal:[], // 门店
            partsVal:[],//角色
            isEditParts:false,//所属门店能否选择
            extraText:'请先选择所属门店'
        }
    }

    //首次
    componentWillMount() {
       this.getShops();
    }

    //获取所属门店
    getShops() {
        axios.get('/api/b/shops/withoutlogo').then(res=> {
                var array = [];
            //让审核不通过，状态为0的数据不显示
                 const newShopsList1 = res.data.map((item,index)=>{
                    if(item.auditStatus != 0){
                        array.push(item)
                    }
               })
            console.log(array,'array')
                //转换数据格式
                const newShopsList = array.map((item,index)=> {
                        return (
                        {
                            label: item.name,
                            value: item.id,
                        }
                        )
                 })
                this.setState({
                  newShopsList,
                })
            })
    }

    //获取所属角色
    getParts(v) {
        console.log('value---',v )
        axios
            .get('/api/b/role/' + v)
            .then(res=> {
                //转换数据格式
                const newPartsList = res.data.map((item)=> {
                    return (
                    {
                        label: item.name,
                        value: item.id ,
                    }
                    )
                })
                this.setState({
                    newPartsList,
                })
            })
    }

    //下一步
    nextStepClick = (e) => {
        e.preventDefault();
        this.props.form.validateFields((errors, value) => {
            if (errors) {
                tools.showError(errors);
            } else {
                //console.log(this.state.checkOn,'checkOn什么状态')
              //  console.log('value--->', value)
              //  console.log('name--', value.salesName)
              //  console.log('mobile--',value.mobile)
             //   console.log('shopsType--',value.shopsType[0])
             //   console.log('partsType--',value.PartsType[0])
                 axios.post(`/api/b/shopassistant/save`,{
                    phone:value.mobile,
                    realName:value.salesName,
                     remindStatus:this.state.checkOn?"1":"0",
                    roleId:value.PartsType[0],
                   shopId:value.shopsType[0],
                    })
                  .then(res => {
                      // const ranNum = new Date().getTime().toString().substring(9);
                      // store.set('ranNum',ranNum)
                      // console.log(`/companyPlatform/addResultPage?id=`+res.data.id + '&ranNum=' + ranNum)
                   this.props.router.push(`/companyPlatform/addResultPage?id=`+res.data.id)
                  }).catch(error => {
                    Toast.fail(error.message, 2);
                });
            };
       })
    }

    checkFun=(status)=>{
        console.log(status,'state')
        this.setState({
            checkOn:status,
        });
    }

    //所属门店 选择事件
    onShopsTypeChange=(value)=>{
        console.log(value,'onShopsTypeChange')
        this.setState({
            isEditParts:true,
            extraText:'',
        })

        this.props.form.setFieldsValue({
            newPartsList:[],
            PartsType:[]
        })

        this.getParts(value);
    }

    //所属角色 选择事件
    onPartsTypeChange=(value)=>{
        console.log(value,'onPartsTypeChange')
    }

    render(){
        const newShopsList = this.state.newShopsList;
        const newPartsList = this.state.newPartsList;
        const checkedBtn = this.state.checkOn;

        const { getFieldProps, getFieldValue, getFieldError } = this.props.form;
        const fieldProps = {
            salesName: {
                validateTrigger: 'onBlur',
                value: 'dfdfdf',
                rules: [
                    {
                        required: true,
                        message: '店员姓名不能为空'
                    }, {
                        min: 1,
                        max: 50,
                        message: '请输入1-32位字符'
                    },
                    ruleType('cn+all')
                ],
            },
            mobile: {
                validateTrigger: 'onBlur',
                rules: [
                    {
                        required: true,
                        message: '手机号码不能为空'
                    },
                    ruleType('mobile')
                ],
            },
            shopsType: {
               validateTrigger: 'onBlur',
                rules: [
                    {
                        required: true,
                        message: '所属门店不能为空'
                    },
                    {
                        pattern: /^\S*$/,
                        message: '所属门店不能为空'
                    }
                ],
                onChange: this.onShopsTypeChange
            },
            PartsType: {
                validateTrigger: 'onBlur',
                rules: [
                    {
                        required: true,
                        message: '所属角色不能为空'
                    },
                    {
                        pattern: /^\S*$/,
                        message: '所属角色不能为空'
                    }
                ],
            onChange: this.onPartsTypeChange
            },
        };

        return(
            <div className="step-wrap">
                <header styleName="container header">为了保证店员真实有效，请如实填写</header>
                <List
                    style={{ backgroundColor: 'white' }}
                    className="picker-list enterFs26"
                >
                    {/*店员姓名*/}
                    <InputItem
                        type='text'
                        placeholder=" "
                        {...getFieldProps('salesName', fieldProps['salesName'])}
                        error={!!getFieldError('salesName')}
                        onErrorClick={
                            () => {
                                Toast.fail(getFieldError('salesName'), 2);
                            }}
                    >
                        店员姓名
                    </InputItem>

                    {/*手机号码*/}
                    <InputItem
                        type="number"
                        placeholder=" "
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

                    {/*所属门店*/}
                    <Picker
                        data={newShopsList}
                        cols={1}
                        className="forss"
                        extra=" "
                        {...getFieldProps('shopsType', fieldProps['shopsType'])}
                    >
                        <List.Item arrow="horizontal">所属门店</List.Item>
                    </Picker>

                    {/*所属角色*/}
                    <Picker
                        data={newPartsList}
                        cols={1}
                        className="forss"
                        disabled={!this.state.isEditParts}
                        extra={this.state.extraText}
                        {...getFieldProps('PartsType', fieldProps['PartsType'])}
                    >
                        <List.Item arrow="horizontal">所属角色</List.Item>
                    </Picker>
                </List>

                <List className="shopFs28">
                    <List.Item
                        extra={<Switch
                            {...getFieldProps('Switch1', {
                                initialValue: checkedBtn,
                                valuePropName: 'checked',
                            })}
                            onChange={(state)=>{this.checkFun(state)}}
                        />}
                    >开通微信收款提醒
                    </List.Item>
                </List>

                <div styleName="btn-container" className="btnKeepDown">
                    <WhiteSpace size="lg" />
                    <Button
                        className="stepBtn"
                        styleName="btn"
                        type="primary"
                        onClick={this.nextStepClick}
                    >保存</Button>
                </div>
            </div>
        )
    }
}
export default createForm()(AddSalesMan);
