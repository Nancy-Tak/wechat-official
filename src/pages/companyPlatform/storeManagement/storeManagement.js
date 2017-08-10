import React from 'react';
import {Link, withRouter } from 'react-router';
import {Icon, Card, WhiteSpace, List, Radio, Flex,Toast, Checkbox   } from 'antd-mobile';
import { axios, session, constants,tools } from 'UTILS';
import ReactDOM,{findDOMNode} from 'react-dom';
import classname from 'classname';
import store from 'store';
import Img from 'ASSETS/images/storePng.png'
import './storeManagement.less'
const icons = ['right'];
const RadioItem = Radio.RadioItem;

class StorageManager extends React.Component {
    constructor(props) {
        super(props);
        tools.setDocumentTitle('门店管理');
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
            storeList: [], //门店列表
            isLoading: false, //是否在加载
            storeNum: 0,
            roleCode: 0,
            companyType: 0
        };
        this.pageNum = 1;

    }

    componentDidMount() {
        this.getStoreNum();
        this.getStoreList();
    }

    renderTopHeight=()=>{
        setTimeout(()=>{
            let addBox=document.getElementById('selectBtnBox');
            let topBarHeight=0;

            if(this.state.companyType == '1' && this.state.roleCode=='1'){
                let topBar=document.getElementById('topBar');
                topBarHeight=topBar.offsetHeight;
            }
            let mask=document.getElementById('mask');
            mask.style.top=(addBox.offsetHeight+topBarHeight)+'px';

            let addBoxHeight = addBox.offsetHeight; //第二层高度
            console.log(topBarHeight ,'顶层高度')
            console.log(addBoxHeight,'第二层高度')

            let bodyHeight = document.body.offsetHeight; //屏幕高度
             console.log(bodyHeight,'屏幕高度')

          let resultHeight = bodyHeight - topBarHeight - addBoxHeight;
            console.log(resultHeight,'高度差')


            this.setState({
                getHeight:resultHeight -20
            })
           // storeListDiv.style.height=resultHeight+ 'px';

        },0);
    }

    //获取门店列表
    getStoreList = (pageNum)=> {
        let {selectedProvince,selectedCity,selectedCounty} = this.state;
        let areaId = 1;
        if (selectedCounty.areaCode) {
            areaId = selectedCounty.areaCode;
        } else if (selectedCity.areaCode) {
            areaId = selectedCity.areaCode;
        } else if (selectedProvince.areaCode) {
            areaId = selectedProvince.areaCode;
        }

        this.pageNum = pageNum || this.pageNum;
        this.setState({
            isLoading: true,
        });
        axios
            .post(`/api/b/shop/search`,{
            areaCode:areaId,
            pageNum: this.pageNum,
            pageSize: 10,
        })
            .then(res=>{
            console.log('get StoreList pageNum==', pageNum)
            console.log('search=====>',res.data.list  )
            let data = [];
                let resList = res.data.list ||[];
            // if(!!res.data|| res.data.pageNum > 1) {
            if(res.data.pageNum > 1 ) {
                data = this.state.storeList.concat(resList);
            } else {
                console.log('enter else ===>',res.data.list , 'resList===>',resList  )
                data = resList
            }
            this.setState({
                storeList:data ,
                isLoading: false,
                noMore:  resList.length < res.data.pageSize,
                // noMore: !!res.data ? res.data.list.length < res.data.pageSize : true,
            });
        }).catch(error=>{
            Toast.fail(error.message, 2);
        })

        // axios.get(`/api/b/shop/list/${areaId}?_t=${new Date().getTime()}`).then(res=> {
        //     this.setState({
        //         storeList: res.data || []
        //     });
        // }).catch(error=> {
        //     Toast.fail(error.message, 2);
        // });

        axios.get('/api/b/merchant/index').then(res=> {
            this.setState({
                roleCode: res.data.roleCode,
                companyType: res.data.companyType
            });
            this.renderTopHeight();
        }).catch(error=> {
            Toast.fail(error.message, 2);
        });
    }

    //上拉加载更多
    onScroll() {
        console.log('scrollHeight',this.refs.lv.style.height, this.refs.lv.scrollHeight, this.refs.lv.scrollTop)
        if(this.state.isLoading == true || this.state.noMore == true) {
            return;
        }
        if(parseInt(this.refs.lv.style.height) + this.refs.lv.scrollTop >= this.refs.lv.scrollHeight) {
            console.log('start pageNum++')
            this.pageNum ++;
            this.getStoreList(this.keyword);
            console.log('getStoreList action')
        }
    }

    //获取门店数量
    getStoreNum = ()=> {
        axios.get(`/api/b/shop/count`).then(res=> {
            this.setState({
                storeNum: res.data.count
            });
        }).catch(error=> {
            Toast.fail(error.message, 2);
        });
    }

    addressBtn = (type)=> {
        if (type == this.state.activeType) {
            return this.setState({
                activeType: null,
                showDataList: [],
            });
        }

        if (type == '0') {
            let code = 1;
            this.getAreaData(code, type);
        } else if (type == '1') {
            let code = this.state.selectedProvince.areaCode;
            if (code) {
                this.getAreaData(code, type);
            } else {
                Toast.info('请先选择省份', 2);
            }
        } else if (type == '2') {
            let code = this.state.selectedCity.areaCode;
            if (code) {
                this.getAreaData(code, type);
            } else {
                Toast.info('请先选择城市', 2);
            }
        }
    }

    getAreaData = (code, type)=> {
        axios.get(`/api/area/${code}`).then(res=> {
            console.log('showDataList===>',res.data )
            this.setState({
                activeType: type,
                storeList:[],
                showDataList: res.data
            });
        }).catch(error=> {
            Toast.fail(error.message, 2);
        });
    }

    onChange = (item)=> {
        let {activeType}=this.state;
        if (activeType == '0') {
            this.setState({
                selectedProvince: item,
                selectedCity: {
                    areaName: '所有城市',
                    areaCode: ''
                },
                selectedCounty: {
                    areaName: '所有区县',
                    areaCode: ''
                },
                activeType: null
            });
        } else if (activeType == '1') {
            this.setState({
                selectedCity: item,
                selectedCounty: {
                    areaName: '所有区县',
                    areaCode: ''
                },
                activeType: null
            });
        } else {
            this.setState({
                selectedCounty: item,
                activeType: null
            });
        }
        setTimeout(()=> {
            this.getStoreList();
        }, 0)
    }

    /**
     * render列表内容
     * */
    renderStoreListContent = ()=> {
        if (this.state.storeList && this.state.storeList.length > 0) {

     //        var shopStatus, shState, shStateNub, id;
     //        const list =  this.state.storeList;
     //        console.log(list,'给了list')
     // //      return this.state.storeList.map((list, index, lists)=> {
     //          const   shopStatus = tools.getShopStatus( list.merchantAuditStatus,  list.merchantStatus,  list.auditStatus,  list.status);
     //            shState = shopStatus.name;
     //            shStateNub = shopStatus.status;
     //        console.log(this.state.storeList,'究竟有什么呀');
     //        console.log(shopStatus,'判断得到什么啊')

                return (
                    <div>
                        <ul className="list pL20" style={{ height:this.state.getHeight, overflow: 'auto'}} ref="lv"  onScroll={this.onScroll.bind(this)}>
                            {this.state.storeList && this.state.storeList.map((n,i)=>{
                                var shState,shStateNub, id;
                               const shopStatus = tools.getShopStatus(n.merchantAuditStatus, n.merchantStatus, n.auditStatus, n.status);
                                shState= shopStatus.name ;
                                shStateNub = shopStatus.status;
                                return(
                                        <li key={i}>
                                            {/*<a href={`/#/companyPlatform/storeManagement/shopsDetail?id=${n.id}`} className="flex">*/}
                                            <a href={`/companyPlatform/storeManagement/shopsDetail?id=${n.id}`} className="flex">
                                                {
                                                    n.merchantLogoPic?<img src={n.merchantLogoPic} className="c-img80"/>:<img src={Img} className="c-img80"/>
                                                }

                                                <div className="flex1">
                                                    <p>{n.name}</p>

                                                    {shStateNub == 0 ?
                                                        ( <p className="org fs22">{shState}</p>)
                                                        : null}

                                                    {shStateNub == -1 ?
                                                        ( <p className="red fs22">{shState}</p>)
                                                        : null}

                                                    {shStateNub == 1 ?
                                                        ( <p className="org fs22">{shState}</p>)
                                                        : null}
                                                </div>
                                                <span className="toLink">
                                <Icon type="right" size="lg" color="#bfbfbf"/>
                                </span>
                                            </a>
                                        </li>
                                )
                            })}
                            <li style={{textAlign: 'center'}} styleName="fs24">{this.state.isLoading ? '正在加载中...' : '已经到底了'}</li>
                        </ul>
                    </div>
                )
          //  }
         //   );
        } else {
            return (
                <p className="noStore">没有门店</p>
            );
         }

    }

    /**
     * render审核状态
     * */
    //renderAuditStatus=(auditStatus,status)=>{
    //    if(auditStatus != '1'){
    //        return
    //    }
    //}
    goShop(){
        store.remove('procecssCode');
        console.log('remove processCode');
        //this.props.router.push('/newConnectInfo');
    }


    render() {
        const { selectedProvince, selectedCity, selectedCounty,showDataList,activeType,storeNum ,roleCode,storeList,companyType} = this.state;

        if (!storeList) return null;
        const btnProvinceCls = classname({
            flex1: true,
            curr: activeType == '0' ? true : false
        });
        const btnCityCls = classname({
            flex1: true,
            curr: activeType == '1' ? true : false
        });
        const btnCountyCls = classname({
            flex1: true,
            curr: activeType == '2' ? true : false
        });
        const popCls = classname({
            pop: true,
            show: activeType != null ? true : false
        });

        const containerCls=classname({
            storeManag:true,
            noScroll:activeType != null ? true : false
        });

        let activeItem = {};
        if (activeType == '0') {
            activeItem = selectedProvince;
        } else if (activeType == '1') {
            activeItem = selectedCity;
        } else {
            activeItem = selectedCounty;
        }

        return (
            <div className={containerCls}>
                {/*顶部*/}
               <div>
                   {companyType == 1 && roleCode == 1 ?
                       (
                           <div className="top pL20" id="topBar">
                               门店数 <span>{storeNum}间</span>

                               <Link onClick={this.goShop} to="/newConnectInfo" className="flex">
                                   添加门店+
                               </Link>
                           </div>

                       ) : null

                   }
               </div>

                {/*地址选择*/}
               <div>
                   <div className="selectCide flex" id="selectBtnBox">
                       <a href="javascript:void(0);" className={btnProvinceCls} onClick={()=>{this.addressBtn(0)}}>
                           {selectedProvince.areaName} <em></em>
                       </a>
                       <a href="javascript:void(0);" className={btnCityCls} onClick={()=>{this.addressBtn(1)}}>
                           {selectedCity.areaName} <em></em>
                       </a>
                       <a href="javascript:void(0);" className={btnCountyCls} onClick={()=>{this.addressBtn(2)}}>
                           {selectedCounty.areaName} <em></em>
                       </a>
                   </div>
                   <div className={popCls} onClick={this.checkSf2} id="mask">

                       <List onClick={this.checkSf3}>
                           {
                               showDataList && showDataList.length > 0 ? showDataList.map((item, index)=> {
                                   return (
                                       <RadioItem key={index}
                                                  checked={activeItem && activeItem.areaCode  === item.areaCode}
                                                  onChange={(e) => this.onChange(item)}>
                                           {item.areaName}
                                       </RadioItem>
                                   )
                               }) : <div style={{textAlign:'center',padding:'8px'}}>无</div>
                           }
                       </List>

                   </div>
               </div>

                {/*门店列表*/}
                <div id='listDiv'>
                    {
                        this.renderStoreListContent()
                    }
                </div>
            </div>

        )
    }


}

export default StorageManager;
