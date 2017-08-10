import React from 'react';
import { withRouter } from 'react-router'
import {
    NavBar,Tabs, WhiteSpace,Toast
} from 'antd-mobile';
import { createForm } from 'rc-form';
import { axios, session,tools } from 'UTILS';
import {InputItem,List,TextareaItem,Button} from 'antd-mobile';
import './style.less'
import store from 'store';

const Item = List.Item;


const UnSafeCharReg = /[^-|，,。.；;：:！!？?“”""'‘’（）()&%@\w\s\u4e00-\u9fa5]/g;

class SetAmount extends React.Component {
    constructor(props) {
        tools.setDocumentTitle('设置金额');
        super(props);
        this.state = {
            money:'',
            name:'',
            id:'',
            remarks:'',
            nextDisabled:true //下一步按钮是否disabled
        }
    }

    componentWillMount() {
        let {gatherName,gatherId} = this.props.location.query;
        if(store.get('tempState')){
            let stateObj=store.get('tempState');
            stateObj.name=gatherName;
            stateObj.id=gatherId;

            let {money,name,id,remarks} = stateObj;
            this.setState({
                money,
                name,
                id,
                remarks
            });

            //判断信息是否填全，使下一步按钮可执行
            if( money.length){
                console.log(money.length);
                this.setState({nextDisabled:false})
            }
        }


    }

    componentDidMount() {

    }

    componentWillUnmount(){

    }
    //跳转到搜索收款人
    goPerson=()=>{
        const {router} = this.props;
        router.push('/cashierCenter/payerSelect');
        store.set('tempState',this.state);
    }
    //点击下一步
    nextStep=()=>{
        const postData = {
            orderAmount:this.state.money.replace(/,/g,''),
            payerId:this.state.id,
            remark :this.state.remarks
        };
        console.log('传参的金额',postData.orderAmount);
        axios.post('/api/b/order/create',postData).then(res => {
            const id = res.data.id;
            console.log("传",id);
            store.remove('tempState');//去掉收款人信息缓存
            const {router} = this.props;
            router.push({
                pathname:'/cashierCenter/tradeComfirm',
                query:{
                    orderId:id,
                    orderAmount:postData.orderAmount,
                    payerId:postData.payerId,
                    remark:postData.remark
                }
            });

        }).catch(error => {
            console.log(error);
            Toast.fail(error.message, 2);
        })
    }

    //存储金额与收款备注
    handleAmountChange(value){

        value = this.numFrame(value);//修改金额格式
        if(value === false) return;//不符合格式直接返回当前页

        this.setState({money: value});


        //判断信息是否填全，使下一步按钮可执行
        let valueKey = value.length;
        if(valueKey){
            this.setState({nextDisabled:false})
        }else{
            this.setState({nextDisabled:true})
        }

    }
    handleRemarksChange(value){

        value = value.replace(UnSafeCharReg, '');
        this.setState({remarks: value.substring(0, 20)});
    }

    //数字保留两位小数，每3位加个逗号
    numFrame(value){
        const amountReg = /^\d{0,8}(?:\.\d{0,2})?$/;//只能输入数字以两位小数

        value = value.replace(/,/g,'');
        console.log('去掉逗号',value);

        if (!amountReg.test(value)) return false;
        if(value){
           value = value.replace(/(\d)(?=(\d{3})+(?:\.\d{0,2})?$)/g, "$1,");//变成每3位数加一个逗号
            console.log('实际输出',value);
             return value;
        }else{
            return value;
        }

    }
    render() {

        return (
            <div className="setMoney">
                <div className="money-text">
                    <InputItem
                      placeholder="请输入收款金额"
                      type="text"
                      extra="¥"
                      ref="Money"
                      value={this.state.money}
                      onChange={this.handleAmountChange.bind(this)}
                    ></InputItem>
                </div>
                <List className="my-list money-list">
                    <Item extra={this.state.name} arrow="horizontal" className="gatherPerson"  onClick={this.goPerson}>指定付款人</Item>
                    <p className="remarks">收款备注（20字以内）：</p>
                    <div className="textArea">
                        <TextareaItem
                          placeholder="如收款信息变动原因等"
                          data-seed="logId"
                          autoHeight
                          onChange={this.handleRemarksChange.bind(this)}
                          count="20"
                          rows="2"
                          ref="Remarks"
                          autoFocus="false"
                          value={this.state.remarks}
                        />
                    </div>
                </List>
                <p className="note-text">请核对以上信息，确保无误后再进行操作</p>
                <div className="money-btn">
                    <Button className="btn" type="primary" onClick={this.nextStep} disabled={this.state.nextDisabled}>下一步</Button>
                </div>
            </div>
        );
    }
}
export default SetAmount;

