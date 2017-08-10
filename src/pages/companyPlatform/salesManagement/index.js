import React from 'react';
import { withRouter, Link } from 'react-router';
import {Icon, Card, WhiteSpace,Toast,SearchBar, Button, WingBlank } from 'antd-mobile';
import { axios, session,tools } from 'UTILS';
import ReactDOM,{findDOMNode} from 'react-dom';
import classname from 'classname';
import store from 'store';
import Scroller from 'silk-scroller';
import './style.less';
const icons = ['right']

class SalesManagement extends React.Component{
    constructor(props){
        super(props);
        tools.setDocumentTitle('店员管理');
        this.state={
            data: [],
            noMoreData:false
        };
        this.pageNum = 1;
        this.keyword = '';
    }
    componentDidMount() {
        this.getData();
    }


    getData(value = '', pageNum){

        this.keyword = value;
        this.pageNum = pageNum || this.pageNum;
        axios.post(`/api/b/shopassistant/search`, {
            keyword: this.keyword,
            pageNum: this.pageNum,
            pageSize: 10,
        }).then(res => {
            let data = [];
            if(res.data.pageNum > 1) {
                data = this.state.data.concat(res.data.list);
            } else {
                data = res.data.list;
            }
            this.setState({
                data,
                noMoreData: res.data.pageNum >= res.data.totalPage,
            });

        }).catch(error => {

            Toast.fail(error.message, 2);
        });
    }

    /**
     * 上拉加载更多动作
     * */
    loadMoreAction=()=> {
        console.log('load more...');
        const {noMoreData}=this.state;
        if(!noMoreData){
            this.pageNum ++;
            this.getData(this.keyword);
        }else{
            console.log('没有更多数据了..');
        }

    }

    //点击删除图标之后，使其失焦
    onHandleClear = ()=> {
        console.log('clear..');
        document.getElementsByClassName('am-search-value')[0].blur();
        return false;
    }
    //聚焦之后,将text-align改为left
    HolderLeft = () =>{
        var AlignLeft = setTimeout(function(){
           var holder = document.getElementsByClassName("am-search-synthetic-ph")[0];
           holder.style.setProperty('text-align', 'left','important');
           console.log("聚焦");

        },0)
    }
    //失焦且为空时，text-align改为center
    HolderCenter = () =>{
        var AlignCenter = setTimeout(function(){
           var holderCenter = document.getElementsByClassName("am-search-synthetic-ph")[0];
           var holderValue = document.getElementsByClassName("am-search-value")[0];
           if(holderValue.value == ""){
              holderCenter.style.setProperty('text-align', 'center','important');
              console.log("失焦");
           }

        },0)
    }

    onCancel() {
        //console.log(this.props)
        //this.props.router.goBack();
    }

    /**
     * 获取列表内容
     * */
    getContent=()=>{
        let {data}=this.state;
        if(data.length>0){
            const getStatus = (n) => {
                if (n.activateStatus == 1) {
                    return {'-1': '待启用', '1': '', '2': <span className="red">已禁用</span>}[n.status];
                } else {
                    return '等待店员激活';
                }
            }
            return data.map((n, i) => (
                <li key={i} styleName={n.status == 2 ? 'gray' : ''} >
                    <Link to={`/companyPlatform/salesDetail?id=${n.id}`}  styleName="flex">
                        <div styleName="flex1">
                            <p  styleName="fs32" > <span className="fn-pr-20">{n.realName}</span >{n.roleName}</p>
                            <p styleName="fs28">所属门店：{n.shopName}</p>
                            <p styleName="fs28">{n.remindStatus == 0 ? '未开通微信收款提醒' :<span className="org">已开通微信收款提醒</span>}</p>
                        </div>

                        <div>
                                <span styleName="flex1">
                                        {getStatus(n)}
                                </span>
                        </div>
                    </Link>
                </li>
            ))
        }else{
            return <li style={{textAlign:'center'}}>暂无数据</li>
        }

    }

        render(){
         const { data,noMoreData } = this.state;

         return(

             <div className="salesclerk">

                 <div id="searchDiv">
                     <SearchBar  placeholder="输入员工姓名、门店全称/简称搜索"  onBlur={this.HolderCenter} onFocus={this.HolderLeft}  onClear={this.onHandleClear} onSubmit={(value) => this.getData(value, 1)} onCancel={this.onCancel.bind(this)}/>
                 </div>

                 <Scroller
                     useLoadMore={!noMoreData}
                     loadMoreAction={this.loadMoreAction}
                     noMoreData={noMoreData}
                     preventDefaultException={{tagName: /^(LI|DIV|SPAN|P)$/}}
                 >
                     <ul styleName="list" style={{
                         overflow: 'auto'}}>
                         {this.getContent()}
                     </ul>
                 </Scroller>

                 <div id='addBtnDiv' className="flexAddSale">
                     <Link to="/CompanyPlatform/addSalesMan" className="add">添加店员</Link>
                 </div>
                {/*
                 <div id='addBtnDiv' className="flexAddSale">
                     <Link to="/CompanyPlatform/addSalesMan" className="add">添加店员</Link>
                 </div>
                 */}

                 {/*
                 <div id='salesList'>
                     <ul styleName="list" style={{
                         height:this.state.getHeight,
                         overflow: 'auto'}} ref="lv" onScroll={this.onScroll.bind(this)}>
                         {this.state.data && this.state.data.map((n, i) => (
                             <li key={i} styleName={n.status == 2 ? 'gray' : ''}>
                                <Link to={`/CompanyPlatform/salesDetail?id=${n.id}`} styleName="flex">
                                    <div styleName="flex1">
                                        <p  styleName="fs32" > <span className="fn-pr-20">{n.realName}</span >{n.roleName}</p>
                                        <p styleName="fs28">所属门店：{n.shopName}</p>
                                        <p styleName="fs28">{n.remindStatus == 0 ? '未开通微信收款提醒' :<span className="org">已开通微信收款提醒</span>}</p>
                                    </div>

                                    <div>
                                <span styleName="flex1">
                                        {getStatus(n)}
                                </span>
                                    </div>
                                </Link>
                            </li>
                         ))}
                         <li style={{textAlign: 'center'}}>{this.state.isLoading ? '正在加载中...' : '已经到底了'}</li>
                     </ul>

                     <div id='addBtnDiv' className="flexAddSale">
                         <Link to="/CompanyPlatform/addSalesMan" className="add">添加店员</Link>
                     </div>

                 </div>
                  */}
             </div>

         )
     }
}
export default SalesManagement;
