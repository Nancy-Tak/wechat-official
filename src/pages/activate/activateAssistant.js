import React from 'react';
import { withRouter } from 'react-router';
import {
    Button, InputItem,
    Toast,List,WingBlank,WhiteSpace
} from 'antd-mobile';
import { createForm } from 'rc-form';
import { axios, tools,ruleType} from 'UTILS';
import './activate.less';
 import store from 'store';
class ActivateForm extends React.Component {
    constructor(props) {
        super(props);
        tools.setDocumentTitle('账号激活');
        this.state = {
            shopInfo:store.get('ACTIVEATE_SHOPINFO') || {},
            phone:store.get('SHOP_KEY_WORD').phone || "",
            realName:store.get('SHOP_KEY_WORD').name || ""
        };
    }


    submit = () => {
        const { form,router} = this.props;
        form.validateFields((errors, value) => {
            if (errors) {
                tools.showError(errors);
            } else {
                value.id=this.state.shopInfo.id;
                axios.post('/api/activate/post', value).then(res=>{

                    if(res.status == '1'){
                        router.push(`/activate/verification?phone=${this.state.phone}`);

                    }else{
                        Toast.fail(`${res.message}`, 2);
                    }

                }).catch(error=>{
                    Toast.fail(error.message, 2);
                });
            }
        });
    };

    post = (value)=>{
        const { router} = this.props;

    };

    render() {
        const {shopInfo,phone,realName } = this.state;
        const {name,roleCode}=shopInfo
        if(!name || !roleCode || !phone || !realName){
            this.props.router.push('/activate/searchShopList');
        }
        const { getFieldProps, getFieldError } = this.props.form;
        const fieldProps = {
            name: {
                validateTrigger: 'onBlur',
                rules: [
                    {
                        required: true,
                        message: '账号不能为空'
                    },
                    {
                        min:1,
                        max:20,
                        message:'账号长度不能超过20'
                    },
                    ruleType('en_num')
                ]
            },
            loginPwd: {
                validateTrigger: 'onBlur',
                rules: [
                    {
                        required: true,
                        message: '密码不能为空'
                    },
                    {
                        max:20,
                        min:8,
                        message:'密码格式有误'
                    },
                    ruleType('en_num_all')
                ]
            }
        };
        return (
            <div className="account-activate-wrap">
                {/*
                <List>

                    <InputItem
                        editable={false}
                        defaultValue={name}
                    >{roleCode===1 ? "商户" : "门店"}名称</InputItem>

                    <InputItem
                        editable={false}
                        defaultValue={phone}
                    >手机号码</InputItem>

                    <InputItem
                        editable={false}
                        defaultValue={realName}
                    >姓名</InputItem>

                </List>
                 */}
                <List>
                    <div className="am-list-item am-input-item my-input-item">
                        <div className="am-input-label am-input-label-5 keyColor">{roleCode===1 ? "商户" : "门店"}名称</div>
                        <div className="am-input-control">
                            <span className="valueColor" style={{whiteSpace:'normal'}}>{name}</span>
                        </div>
                    </div>
                    <div className="am-list-item am-input-item">
                        <div className="am-input-label am-input-label-5 keyColor">手机号码</div>
                        <div className="am-input-control">
                            <span className="valueColor">{phone}</span>
                        </div>
                    </div>
                    <div className="am-list-item am-input-item">
                        <div className="am-input-label am-input-label-5 keyColor">姓名</div>
                        <div className="am-input-control">
                            <span className="valueColor">{realName}</span>
                        </div>
                    </div>
                </List>
                <div className="activate-title">请输入以下信息激活账号</div>
                <List>
                    <InputItem
                        placeholder="用于账号登录"
                        {...getFieldProps('name', fieldProps['name'])}
                        error={!!getFieldError('name')}
                        onErrorClick={
                                () => {Toast.fail(getFieldError('name'),2);}
                            }
                    >账号名称</InputItem>

                    <InputItem
                        placeholder="8~20位字母,数字或符号组合"
                        {...getFieldProps('loginPwd', fieldProps['loginPwd'])}
                        error={!!getFieldError('loginPwd')}
                        type="password"
                        onErrorClick={
                                () => {Toast.fail(getFieldError('loginPwd'),2);}
                            }
                    >登录密码</InputItem>

                </List>

                <WingBlank>
                    <Button className="activate" type="primary" onTouchStart={this.submit}>下一步</Button>
                </WingBlank>
            </div>
        );
    }
}

export default withRouter(createForm()(ActivateForm))




