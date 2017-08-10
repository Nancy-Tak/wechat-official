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


class ConnectInfo extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        tools.setDocumentTitle('企业入驻');
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
        store.remove('procecssId')
        console.log('what the fuck',store.get('procecssId'))
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
                let data=res.data || [];
                const newConnectTypes = data.map((item)=> {
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
                let data=res.data || [];
                const newAgencyType = data.map((item)=> {
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
        //IdCard
        let IdCard=this.props.form.getFieldValue('IdCard');
        if(!tools.testIdCard(IdCard)){
            return Toast.fail('请输入正确的身份证号码',2);
        }
        this.props.form.validateFields((errors, value) => {
            if (errors) {
                 tools.showError(errors);
            } else {
                console.log('formdata::', value);

                let data={
                    phone:value.mobile,
                    agencyId:value.bank[0],
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
        if(this.state.clickTimes==19){
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
            IdCard: {
                initialValue:this.state.bValue,
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
                initialValue:this.state.reData.connectorType != null ? [this.state.reData.connectorType] : [],
                validateTrigger: 'onBlur',
                rules: [
                    {
                        required: true,
                        message: '联系人类型不能为空'
                    },
                    // {
                    //     pattern: /^\S*$/,
                    //     message: '联系人类型不能为空'
                    // }
                ],
                onChange: this.onConnectTypeChange
            },
            bank: {
                initialValue:this.state.reData.agencyId ? [this.state.reData.agencyId] : [],
                validateTrigger: 'onBlur',
                rules: [
                    {
                        required: true,
                        message: '所属机构不能为空'
                    },
                   // {
                   //     pattern: /^[\u4E00-\u9FA5\uf900-\ufa2d]+$/,
                  //      message: '只能是中文'
                  //  }
                ],
                onChange: this.onBankChange
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
//                      pattern: /^13[0-9]{9}$|^147[0-9]{8}$|^15[0-9]{9}$|^17(0|7)[0-9]{8}$|^18[0-9]{9}$/,
//                      message: '手机号码格式不正确'
//                  },
                ],
                initialValue:this.state.reData.phone,
            },
            users: {
                validateTrigger: 'onBlur',
                rules: [
                    {
                        required: true,
                        message: '姓名不能为空'
                    },{
                        min:1,
                        max:50,
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
                {/*用户须知内容*/}
                <Modal
                    title="———用户须知———"
                    transparent
                    maskClosable={false}
                    visible={this.state.visibleTest}
                    onClose={this.onCloseTest}
                    className='user-right'
                    footer={[{
                        text: '同意', onPress: () => {
                            this.onAgreeTest();
                        }
                    }]}
                >
                    <h4>用户服务协议</h4>
                    <h5 style={{textAlign:'left'}}>一、声明与承诺</h5>
                    <h5 style={{textAlign:'left'}}>二、E+账户企业代收付系统账户或账号安全</h5>
                    <p>（一）入驻相关</p>
                    <p>（二）账户或账号安全</p>
                    <p>（三）禁用相关</p>
                    <h5 style={{textAlign:'left'}}>三、有关E+账户企业代收付系统服务</h5>
                    <p>（一）服务内容</p>
                    <p>（二）服务费用</p>
                    <p>（三）服务使用限制</p>
                    <p>（四）服务暂停或终止</p>
                    <h5 style={{textAlign:'left'}}>四、服务中断及不可抗力</h5>
                    <p>（一）若本系因下列状况导致服务暂停或中断的，本公司不承担违约或赔偿责任：</p>
                    <p>（二）本公司需要定期或不定期地对提供本服务及承载该系统的设备进行调整、检修或者维护，如因此类情况而造成网络服务（包括收费网络服务）在合理时间内的中断，本公司无需为此承担任何责任。本公司保留不经事先通知为维修保养、升级或其它目的暂停本服务全部或部分功能的权利。</p>
                    <h5 style={{textAlign:'left'}}>五、责任范围及责任限制</h5>
                    <p>（一）本公司仅对本协议中列明的责任承担范围负责。</p>
                    <p>（二）您明确因使用本服务进行的交易所产生的任何风险应由您与交易对方承担。</p>
                    <p>（四）本公司不对您的交易标的及本服务提供任何形式的保证，包括但不限于以下事项:</p>
                    <p>（五）本公司用户信息是由用户本人自行提供的，本公司无法保证该信息之准确、及时和完整，您应对您的判断承担全部责任。</p>
                    <p>（六）您使用本服务过程中所下载或取得的任何资料，应由您自行考量且自负风险，因资料之下载而导致您电脑系统之任何损坏或资料流失，您应负完全责任。</p>
                    <p>（七）您自本公司及本公司工作人员或经由本服务取得的建议和资讯，无论其为书面或口头形式，均不构成本公司对本服务之任何保证。</p>
                    <p><b>（八）在任何情况下，本公司对于与本协议有关或由本协议引起的任何间接的、惩罚性的、特殊的、派生的损失（包括业务损失、收益损失、利润损失、商誉损失、使用数据或其他经济利益的损失），不论是如何产生的，也不论是由于对本协议的违约（包括违反保证）还是由侵权造成的，均不负有任何责任，即使事先已被告知此等损失的可能性。另外即使本协议规定的排他性救济没有达到其基本目的，也应排除本公司对上述损失的责任。</b></p>
                    <p>（九）在任何情况下，本公司对本协议所承担的违约赔偿责任总额不超过向您收取的当次服务费用（如有）总额。</p>
                    <p>（十）您充分知晓并同意本公司可能同时为您及您的交易对手方提供本服务，您同意对本公司可能存在的该等行为予以明确豁免，并不得以此来主张本公司在提供本服务时存在法律上的瑕疵。</p>
                    <p>（十一）除本协议另有规定或本公司另行同意外，您对本公司的委托及您向本公司发出的指令均不可撤销。</p>
                    <h5 style={{textAlign:'left'}}>六、隐私权保护</h5>
                    <h5 style={{textAlign:'left'}}>七、授权许可使用</h5>
                    <h5 style={{textAlign:'left'}}>八、知识产权的保护</h5>
                    <p>（一）除第三方产品或服务外，本网站上全部智力成果，包括但不限于数据库、软件、著作、照片、录像、音乐、声音及其前述组合，软件编译、相关源代码和软件 (包括小应用程序和脚本) 档案、资讯、资料、架构、页面设计，均由本公司或本公司关联企业依法拥有其知识产权，包括但不限于版权、商标权、专利权、著作权、商业秘密等。</p>
                    <p>（二）非经本公司或本公司关联企业书面同意，任何人不得擅自使用、修改、复制、公开传播、改变、散布、发行或公开发表本网站上任何材料或内容。</p>
                    <p>（三）您确认，当您同意本协议时，或您访问本公司网站及其相关网站，或您使用我们提供的任一服务时，即不可撤销的授予本公司基于商业宣传目的在本公司网站、宣传材料等各推广平台上对您的信息、企业名称、商标、字号等进行使用的权利。</p>
                    <p>（四）尊重知识产权是您应尽的义务，如有违反，您应承担损害赔偿责任。</p>
                    <h5 style={{textAlign:'left'}}>九、完整协议</h5>
                    <p>（一）本协议由《用户服务协议》条款与《隐私权政策》等本网站不时公示的各项规则组成，各项规则有约定，而本协议条款没有约定的，以各项规则约定为准。</p>
                    <p>（二）您对本协议理解和认同，您即对本协议所有组成部分的内容理解并认同，一旦您按本协议约定的程序取得本系统账户或账号，或您以其他本公司允许的方式实际使用本服务，您和本公司即受本协议所有组成部分的约束。</p>
                    <p>（三）本协议部分内容被有管辖权的法院依法认定为违法或无效的，不因此影响其他内容的效力。</p>
                    <h5 style={{textAlign:'left'}}>十、法律适用与管辖</h5>
                    <p>（一）本服务协议的订立、执行和解释及争议的解决均应适用中华人民共和国法律。</p>
                    <p>（二）因本协议引起的或与本协议有关的任何争议，尽最大诚意进行友好协商，如果双方不能协商一致，则双方可向本公司所在地法院提起诉讼。</p>
                </Modal>

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
                        //onClick={this.checkEvenClick}
                        //onTouchStart={this.checkEvenClick}
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
                    <header
                        styleName="container header"
                        onTouchStart={this.checkEvenClick}
                    >
                        签约信息 您将与该银行签订收单合同</header>
                    {/*所属机构*/}
                    <Picker
                        data={newAgencyType}
                        cols={1}
                        className="forss"
                        extra="选择您的签约银行"
                        value={this.state.bValue}
                        {...getFieldProps('bank', fieldProps['bank'])}
                    >
                        <List.Item arrow="horizontal">所属机构</List.Item>
                    </Picker>
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

                {/* 协议信息(暂时注释) */}
                {/*
                <Flex>
                    <Flex.Item>
                        <AgreeItem
                            data-seed="logId"
                            { ...getFieldProps('agree', fieldProps['agree']) }
                            checked={ this.state.agreeChecked }
                        >
                            已阅读并同意《<a onClick={this.showModalTest}>用户须知</a>》
                        </AgreeItem>
                    </Flex.Item>
                </Flex>
                 */}

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
export default createForm()(ConnectInfo);
