import React from 'react';
import { withRouter } from 'react-router';
import {
    NavBar,
    WhiteSpace,
    List,
    Switch,
    Picker,
    Button,
    NoticeBar,
    Icon,
    Toast,Modal
} from 'antd-mobile';
import { axios, tools } from 'UTILS';
import { createForm } from 'rc-form';
import './style.less';
import store from 'store';
const alert = Modal.alert;
import eLogo from 'ASSETS/images/eLogo.png';

class SalesManagement extends React.Component{
    constructor(props){
        super(props);
        tools.setDocumentTitle('店员详情');
        this.state={
            data:'',
            checkOn:'', //收款提醒开关
            checkedState:'', //开关状态 ？？
            Switch2Words:'',
            id:this.props.location.query.id,
            modal1:false,
            modal2:false
        }
    }

    componentDidMount() {
        this.init()
    }
    init() {
        axios.get(`/api/b/shopassistant/` + this.state.id )
           .then(res => {
            console.log(res.data ,'res.data')
            let data=res.data;
            this.setState({
                data: data,
                Switch2Words:data.status == '-1' ? '已禁用': data.status =='1'? '已生效':'已禁用', //number 赋值给Switch2Words，由它来决定页面字体是生效还是禁用
                checkedState:data.status=='-1' ?  false : data.status =='1'? true : false ,// 按钮开关状态 Boolean
            });
        }).catch(error => {
            Toast.fail(error.message, 2);
        });
    }

    //改变提醒状态
    changeRemindState=(status)=>{
        console.log(status,'state')
        this.setState({
            checkOn:status,
        });
        const staNo = status == false ? '0' :'1'
        console.log(staNo,'what is staNo')
        axios.post(`/api/b/shopassistant/` + this.state.id + '/changeremindstatus',{
            status:staNo
        })
            .then(res => {
        console.log('后台知道要改变提醒状态了~')
         }).catch(error => {
             Toast.fail(error.message, 2);
            this.init();
            console.log('改变提醒状态失败啦，我在尝试init啦')
        });
    }
    //启用禁用店员
    changeSalesState=(status)=>{
        const staNo2 = status == false ? "2": "1";
        console.log('onChange status===>',status ,'staNo2===>',staNo2)
         axios.post(`/api/b/shopassistant/`+ this.state.id +'/changestatus',{
             status:staNo2
         })
             .then(res => {
                 this.setState({
                     Switch2Words:staNo2 =='1'? '已生效':'已禁用',
                     checkedState:staNo2 == '1'? true : false ,
                 });
                 console.log('成功了，and我设置好状态了')
         }).catch(error => {
              Toast.fail(error.message, 2);
          });
    }

    //发送短信通知
    sendMessage=()=>{
        axios.get(`/api/b/shopassistant/` + this.state.id + '/smsnotify')
          .then(res => {
              Toast.info(`已发短信通知店员`,3)
        }).catch(error => {
            Toast.fail(error.message, 2);
       });
    }
    //删除店员
    delSales=()=>{
         axios.get(`/api/b/shopassistant/` + this.state.id + '/delete')
              .then(res => {
                     this.props.router.push(`/companyPlatform/salesManagement`)
         }).catch(error => {
             Toast.fail(error.message, 2);
         });
    }

    showModal=(id)=>{
        this.setState({
            [id]:true
        });
    }

    hideModal=(id)=>{
        this.setState({
            [id]:false
        });
    }

    render(){
        const { data } = this.state;
       //  if(!data ) return null ;
        // const data = {
        //     "activateStatus": 1, //激活状态：-1 =未激活，1=已激活
        //     "id": "288315014232698880", //店员ID
        //     "phone": "13300000000", //手机号码
        //     "realName": "兢兢业业小店员", //店员真实姓名
        //     "remindStatus": 1, //开通微信收款提醒：0=未开启，1=已开启
        //     "roleName": "收银员", //店员角色名称
        //     "shopName": "钱途六六六", //所属门店名称
        //     "status": 1, //启用/禁用状态：-1=待启用，1=启用，2=禁用
        //     "wechatName": "测试内容el5b" //关联微信号

        const { getFieldProps } = this.props.form;
        const fieldProps = {
            Switch1: {
                initialValue:data.remindStatus == 0 ?false :true,
                validateTrigger: 'onBlur',
                valuePropName: 'checked',
                onChange: this.changeRemindState
            },
            Switch2: {
               initialValue:data.status == 1 ? true:false ,
                validateTrigger: 'onBlur',
                valuePropName: 'checked',
               onChange: this.changeSalesState,

            },
        }
        return(
            <div>
                <WhiteSpace size="lg" />
                <div styleName="infoBox">
                    <div className="fn-mb-30">
                        <div styleName="key">店员姓名</div>
                        <div styleName="vals">{data.realName} </div>
                    </div>
                    <div className="fn-mb-30">
                        <div styleName="key">手机号码</div>
                        <div styleName="vals">{data.phone }</div>
                    </div>
                    <div className="fn-mb-30">
                        <div styleName="key">所属门店</div>
                        <div styleName="vals">{data.shopName}</div>
                    </div>
                    <div>
                        <div styleName="key">所属角色</div>
                         <div styleName="vals">{data.roleName}</div>
                    </div>
                </div>

                <div>
                    <WhiteSpace size="sm" />
                    <List className="shopFs28">
                        <List.Item
                            styleName="paddingLeft15"
                            extra={<Switch
                                {...getFieldProps('Switch1', fieldProps['Switch1'])}
                            />}
                        >开通微信收款提醒
                        </List.Item>
                    </List>
                    <WhiteSpace size="sm" />
                    <div styleName='statusBox'>
                        <div styleName="infoBox">
                            <div styleName="key">绑定情况</div>
                            <div
                                styleName="vals"
                                style={{textAlign:'right'}}
                            >
                                {data.isBind ? '已绑定微信' : <span>未绑定微信 <span className="questionTip" onClick={()=>{this.showModal('modal1')}}></span></span>}
                            </div>
                        </div>

                        {/*
                            data.isBind? null :
                                <div
                                styleName='partRight'
                                onClick={this.sendMessage}
                            >
                            <span>
                                <img
                                    styleName='eLogoSet'
                                    src={eLogo} alt=""/>
                            </span>
                                通知店员</div>
                         */}

                    </div>
                    <WhiteSpace size="sm" />
                    {data.activateStatus == -1?
                        <div styleName="infoBox">
                            <div styleName="key">状态</div>
                            <div
                                style={{textAlign:'right'}}
                                styleName="vals"
                            >

                                <span>等待店员激活 <span className="questionTip" onClick={()=>{this.showModal('modal2')}}></span></span>
                            </div>
                        </div>
                        :
                        <List className="shopFs28" >
                            <List.Item
                                styleName="paddingLeft15"
                                extra={
                                    <div styleName='testBox'>
                                        <div styleName="fatherBtn">
                                           <span> {this.state.Switch2Words}</span>
                                        </div>
                                        <Switch
                                            {...getFieldProps('Switch2',
                                                fieldProps['Switch2'])}
                                            disabled={data.status=="-1"?  true :false }
                                            checked={this.state.checkedState}
                                        />
                                    </div>}
                            >状态
                            </List.Item>

                        </List>
                    }

                </div>

                <div className="account-login-wrap">
                    <Button
                        className="login"
                        styleName="recordBtn"
                        type="primary"
                        onClick={(e) => {
                            e.preventDefault();
                            alert('删除店员', '确定删除该店员吗?', [
                                { text: '取消', onPress: () => console.log('cancel') },
                                { text: '确定', onPress: () =>{
                                    this.delSales()
                                }},
                            ])
                        }}
                    >
                        删除店员</Button>
                </div>
                <Modal
                    title="开启提示"
                    transparent
                    maskClosable={false}
                    visible={this.state.modal1}
                    footer={[{ text: '确定', onPress: () => { this.hideModal('modal1') } }]}
                >
                    <p style={{textAlign:'left'}}>如店员已激活,请通知其开启收款消息提醒</p>
                    <p style={{textAlign:'left',marginBottom:'8px'}}>步骤:</p>
                    <p style={{textAlign:'left',marginTop:'8px',color:'#333'}}>关注微信号"请付吧" - 点击收款消息提醒</p>
                </Modal>
                <Modal
                    title="开启提示"
                    transparent
                    maskClosable={false}
                    visible={this.state.modal2}
                    footer={[{ text: '确定', onPress: () => { this.hideModal('modal2') } }]}
                >
                    <p style={{textAlign:'left'}}>开展收款业务须先激活账号,请通知店员激活.</p>
                    <p style={{textAlign:'left',marginBottom:'8px'}}>步骤:</p>
                    <p style={{textAlign:'left',marginTop:'8px',color:'#333'}}>关注微信号"招商银行企业网上银行" - 点击"E收款"</p>
                </Modal>
            </div>
        )
    }
}
export default withRouter(createForm()(SalesManagement))
