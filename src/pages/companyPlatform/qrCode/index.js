import React from 'react';
import { withRouter } from 'react-router';
import { Icon, Card, WhiteSpace, List, Radio, Flex, Button,Toast } from 'antd-mobile';
import { axios, session, constants,tools } from 'UTILS';
import { createForm } from 'rc-form';
import ReactDOM, { findDOMNode } from 'react-dom';
import classname from 'classname';
import store from 'store';
import Img from 'ASSETS/images/storePng.png'

import './style.less'
const icons = ['right'];
const RadioItem = Radio.RadioItem;


class QrCode extends React.Component {
    constructor(props) {
        super(props);
         tools.setDocumentTitle('我的二维码');
        this.state = {
            activeType: null,
            selectedProvince: {
                areaName: '所有省份',
                areaCode: ''
            },
            selectedCity: {
                areaName: '所有城市',
                areaCode: ''
            },
            selectedCounty: {
                areaName: '所有区县',
                areaCode: ''
            },
            showDataList: [],
            storeList:[],
            str:"",
            pop:false,
            companyType: 0
        };

    }

    componentDidMount(){
        this.getStoreList();
        axios.get('/api/b/merchant/index').then(res=> {

            this.setState({
                companyType: res.data.companyType
            });
        }).catch(error=> {
            Toast.fail(error.message, 2);
        });
        let addBox=document.getElementById('selectBtnBox');
        let mask=document.getElementById('mask');
        mask.style.top=addBox.offsetHeight+'px';
    }
    //获取门店列表
    getStoreList=()=>{
        let {selectedProvince,selectedCity,selectedCounty} = this.state;
        let areaId=1;
        if(selectedCounty.areaCode){
            areaId=selectedCounty.areaCode;
        }else if(selectedCity.areaCode){
            areaId=selectedCity.areaCode;
        }else if(selectedProvince.areaCode){
            areaId=selectedProvince.areaCode;
        }

        axios.get(`/api/b/shop/list/${areaId}`).then(res=>{
            this.setState({
                storeList:res.data || []
            });
        }).catch(error=>{
            Toast.fail(error.message, 2);
        });

    }

    addressBtn=(type)=>{
        if(type == this.state.activeType){
            return this.setState({
                activeType:null,
                showDataList:[]
            });
        }

        if(type == '0'){
            let code=1;
            this.getAreaData(code,type);
        }else if(type == '1'){
            let code=this.state.selectedProvince.areaCode;
            if(code){
                this.getAreaData(code,type);
            }else{
                Toast.info('请先选择省份',2);
            }
        }else if(type =='2'){
            let code=this.state.selectedCity.areaCode;
            if(code){
                this.getAreaData(code,type);
            }else{
                Toast.info('请先选择城市',2);
            }
        }

    }
    goStore=()=>{
        store.remove('procecssCode');
        const {router} = this.props;
        router.push(`/newConnectInfo`);
    }
    getAreaData=(code,type)=>{
        axios.get(`/api/area/${code}`).then(res=>{
            this.setState({
                activeType:type,
                showDataList:res.data
            });
        }).catch(error=>{
            Toast.fail(error.message, 2);
        });
    }
    colsePop=()=>{
    	this.setState({
				pop: false
		});
    }
    onChange=(item)=>{
        let {activeType}=this.state;
        if(activeType == '0'){
            this.setState({
                selectedProvince:item,
                selectedCity: {
                    areaName: '所有城市',
                    areaCode: ''
                },
                selectedCounty: {
                    areaName: '所有区县',
                    areaCode: ''
                },
                activeType:null
            });
        }else if(activeType=='1'){
            this.setState({
                selectedCity:item,
                selectedCounty: {
                    areaName: '所有区县',
                    areaCode: ''
                },
                activeType:null
            });
        }else{
            this.setState({
                selectedCounty:item,
                activeType:null
            });
        }
        setTimeout(()=>{
            this.getStoreList();
        },0)

    }
    linkCode=(obj,id)=>{

		if(obj==2){
		const {router} = this.props;
        router.push(`/companyPlatform/qrCode/myQrcode?shopid=${id}`);
		}else if(obj==0){
			this.setState({
                pop:true,
                str:'门店信息审核不通过，请在门店管理重新提交门店审核申请。'
            });
		}else if(obj==-1){
			this.setState({
                pop:true,
                str:'门店已禁用，请在门店管理重新开启。'
            });
		}else if(obj==1){
			this.setState({
                pop:true,
                str:'门店信息审核中，请耐心等待结果。'
            });
		}


	}

    /**
     * render列表内容
     * */
    renderStoreListContent=()=> {

        if(this.state.storeList.length >0){
        	var shopStatus,shState,shStateNub,id;
            return this.state.storeList.map((list,index,lists)=>{
         		shopStatus=tools.getShopStatus(list.merchantAuditStatus,list.merchantStatus,list.auditStatus,list.status);
				 shState = shopStatus.name;
				 shStateNub = shopStatus.status;
				 id=list.id;

                return(
                 <li key={index} onClick={this.linkCode.bind(this, shStateNub,id)}>

                        <a href="javascript:;" styleName="flex">
                           {
                        	list.merchantLogoPic?<img src={list.merchantLogoPic} className="c-img80"/>:<img src={Img} className="c-img80"/>
                        }

                            <div styleName="flex1">
                                <p>{list.name}</p>
                                {shStateNub==0 ?
                                	( <p styleName="org fs22">{shState}</p>)
                                	: null}

                                {shStateNub==-1?
                                	( <p styleName="red fs22">{shState}</p>)
                                	: null}

                                {shStateNub==1?
                                	( <p styleName="org fs22">{shState}</p>)
                                	: null}

                            </div>
                            <span styleName="toLink">
                                <Icon type="right" size="lg" color="#bfbfbf"/>
                            </span>
                        </a>
                    </li>
                )
            });
        }else{
            return(
                <div className="noStores">
                    <p>没有门店</p>
					{
						this.state.companyType== 1?
						( <Button onClick={this.goStore}>添加门店</Button>):null
					}

                </div>

            );
        }

    }

    render() {
        const { selectedProvince, selectedCity, selectedCounty,showDataList,activeType,pop,str,storeList } = this.state;
        if(!storeList) return null;

        const btnProvinceCls=classname({
            flex1:true,
            curr:activeType == '0' ? true :false
        });
        const btnCityCls=classname({
            flex1:true,
            curr:activeType == '1' ? true :false
        });
        const btnCountyCls=classname({
            flex1:true,
            curr:activeType == '2' ? true :false
        });
        const popCls=classname({
            pop:true,
            show:activeType != null ? true : false
        });

        const containerCls=classname({
            qrCode:true,
            noScroll:activeType != null ? true : false
        });


        let activeItem={};
        if(activeType=='0'){
            activeItem=selectedProvince;
        }else if(activeType=='1'){
            activeItem=selectedCity;
        }else{
            activeItem=selectedCounty;
        }

        return (
            <div className={containerCls} styleName="pL20">
            	{pop==true?(
            			<div className="popSh">
                    	<div>
							<p>{str}</p>
							<a href="#" onClick={this.colsePop}>确定</a>
						</div>
					</div>
            ):null}
                {/*地址选择*/}
                <div className="selectCide flex" id="selectBtnBox">
                    <a href="#" className={btnProvinceCls} onClick={()=>{this.addressBtn(0)}}>
                        {selectedProvince.areaName} <em></em>
                    </a>
                    <a href="#" className={btnCityCls} onClick={()=>{this.addressBtn(1)}}>
                        {selectedCity.areaName} <em></em>
                    </a>
                    <a href="#" className={btnCountyCls} onClick={()=>{this.addressBtn(2)}}>
                        {selectedCounty.areaName} <em></em>
                    </a>
                </div>
                <div className={popCls} onClick={this.checkSf2} id="mask">

                    <List onClick={this.checkSf3}>
                        {
                            showDataList.length>0 ? showDataList.map((item, index)=> {
                                return(
                                    <RadioItem key={item.areaCode} checked={activeItem.areaCode && activeItem.areaCode === item.areaCode}
                                               onChange={(e) => this.onChange(item)}>
                                        {item.areaName}
                                    </RadioItem>
                                )
                            }) : <div style={{textAlign:'center',padding:'8px'}}>无</div>
                        }
                    </List>

                </div>

                <ul styleName="list pL20">
                    {this.renderStoreListContent()}
                    {/*
                    <li>
                        <a href="#" styleName="flex">
                            <img src="src/pages/companyPlatform/storeManagement/tx.jpg" styleName="c-img80"/>
                            <div styleName="flex1">
                                <p>真功夫（高德置地店）</p>
                                <p styleName="green fs22">审核中</p>
                            </div>
                            <span styleName="toLink">
                                <Icon type="right" size="lg" color="#bfbfbf"/>
                            </span>
                        </a>
                    </li>
                    <li>
                        <a href="#" styleName="flex">
                            <img src="../tx.jpg" styleName="c-img80"/>
                            <div styleName="flex1">
                                <p>真功夫（高德置地店）</p>
                                <p styleName="red fs22">已禁用</p>
                            </div>
                            <span styleName="toLink">
                                <Icon type="right" size="lg" color="#bfbfbf"/>
                            </span>
                        </a>
                    </li>
                    <li>
                        <a href="#" styleName="flex">
                            <img src="src/pages/companyPlatform/storeManagement/tx.jpg" styleName="c-img80"/>
                            <div styleName="flex1">
                                <p>真功夫（高德置地店）</p>
                                <p styleName="org fs22">审核不通过</p>
                            </div>
                            <span styleName="toLink">
                                <Icon type="right" size="lg" color="black"/>
                            </span>
                        </a>
                    </li>
                     */}
                </ul>

            </div>
        )
    }
}

export default createForm()(QrCode);
