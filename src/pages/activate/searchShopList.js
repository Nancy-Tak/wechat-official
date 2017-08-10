import React from 'react';
import { withRouter } from 'react-router';
import {
    Button, InputItem,
    Toast,List,WingBlank
} from 'antd-mobile';
import { createForm } from 'rc-form';
import { axios, tools,ruleType} from 'UTILS';
import store from 'store';
import './activate.less';
// import store from 'store';
class searchShopList extends React.Component {
    constructor(props) {
        super(props);
        tools.setDocumentTitle('账号激活');
        this.state = {};
    }

    submit = () => {
        const { form,router} = this.props;
        form.validateFields((errors, value) => {
            if (errors) {
                tools.showError(errors);
            } else {

                axios.post(`/api/activate/verify`,value).then((res)=>{
                    let result=res.data && res.data.location;
                    if(result === 3){
                        let data={
                            phone:value.phone,
                            name:value.realName
                        }
                        store.set('SHOP_KEY_WORD',data);
                        this.props.router.push('/activate/shopList');
                    }else{
                        return Toast.info('找不到您的门店,请向您的门店确认');
                    }
                }).catch((error)=>{
                    Toast.fail(error.message, 2);
                });


            }
        });
    };

    render() {
        const { getFieldProps, getFieldValue, getFieldError } = this.props.form;
        const fieldProps = {
            realName: {
                validateTrigger: 'onBlur',
                rules: [
                    {
                        required: true,
                        message: '姓名不能为空'
                    },
                    {
                        min:1,
                        max:32,
                        message:'账号名格式有误'
                    },
                    ruleType('cn_all')
                ]
            },
            phone:{
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

        };
        return (
            <div className="account-activate-wrap">
                <div className="activate-title">请输入以下信息查看您的商户/门店</div>
                <List>

                    <InputItem
                        placeholder="请输入真实姓名"
                        {...getFieldProps('realName', fieldProps['realName'])}
                        error={!!getFieldError('realName')}
                        onErrorClick={
                           () => {
                           Toast.fail(getFieldError('realName'), 2);
                           }}
                    >姓名</InputItem>

                    <InputItem
                        placeholder="已授权登录的手机号码"
                        {...getFieldProps('phone', fieldProps['phone'])}
                        error={!!getFieldError('phone')}
                        type="number"
                        onErrorClick={
                            () => {Toast.fail(getFieldError('phone'),2);}
                         }
                    >手机号码</InputItem>

                </List>
                <WingBlank>
                    <Button className="activate" type="primary" onTouchStart={this.submit}>查询</Button>
                </WingBlank>
            </div>
        );
    }
}

export default withRouter(createForm()(searchShopList))




