import React from 'react';
import {link, withRouter } from 'react-router';
import {
    Icon, Button, InputItem,
    WhiteSpace, Toast,List,WingBlank
} from 'antd-mobile';
import { axios, tools } from 'UTILS';
import Scroller from 'silk-scroller';
import moment from 'moment';
import classname from 'classname';
import './style.less'

class MyBills extends React.Component{
    constructor(props){
        super(props);
        tools.setDocumentTitle('我的账单');
        this.state={
            billLists:[],
            total:0,
            nowPage:0,
            noMoreData:false
        };
    }

    componentDidMount(){
        this.fetchData(1,10);
    }

    goBillReports=()=>{
        const {router} = this.props;
        router.push('/companyPlatform/myBills/billReports');
    }

    /**
     * 获取数据
     * */
    fetchData=(pageNum, pageSize)=> {
        axios.post(' /api/b/report/orderflow',{pageNum,pageSize}).then(res=>{
            const lists = res.data.list || [];
            const total = res.data.total;
            if(pageNum == '1'){
                let noMoreData=false;
                if(lists.length<total){
                    noMoreData=false;
                }else{
                    noMoreData=true;
                }
                this.setState({
                    billLists: lists,
                    total:total,
                    nowPage:pageNum,
                    noMoreData:noMoreData
                });
            }else{
                let billLists=this.state.billLists.concat(lists);
                console.log('不是第一页,列表length:',billLists.length);
                console.log('total:',total);
                let noMoreData=false;
                if(billLists.length<total){
                    noMoreData=false;
                }else{
                    noMoreData=true;
                    console.log('大于了');
                }
                this.setState({
                    billLists: this.state.billLists.concat(lists),
                    total:total,
                    nowPage:pageNum,
                    noMoreData
                });
            }

        }).catch(error=>{
            Toast.fail(error.message, 2);
        });

    }

    /**
     * 上拉加载更多动作
     * */
    loadMoreAction=()=> {
        console.log('load more...');
        const {nowPage,noMoreData}=this.state;
        if(!noMoreData){
            this.fetchData(nowPage+1,10);
        }else{
            console.log('没有更多数据了..');
        }

    }

    /**
     * 获取列表内容
     * */
    getContent=()=> {
        if(this.state.billLists.length>0){
            return this.state.billLists.map((list,index,lists)=>{
                let preListDate=0;
                if(index !=0){
                    preListDate=new Date(lists[index-1].completeTime);
                }
                let date=new Date(list.completeTime);
                let isShowY='none';
                if(preListDate !=0 && preListDate.getFullYear() != date.getFullYear()){
                    isShowY='block';
                }
                let year=date.getFullYear();
                let day=date.getMonth()+1 +'-'+date.getDate();
                if(new Date().getMonth() == date.getMonth() && new Date().getDate()== date.getDate()){
                    day='今天';
                }
                let minutes=date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
                let time =date.getHours() +':'+minutes;
                let cls1=classname({
                    icon:true,
                    out:list.payType=='3' ? true : false,
                    in:list.payType=='1' ? true : false
                });
                let cls2=classname({
                    red:list.payType=='3' ? true : false
                });
                let receiptAmount=list.payType=='1' ? list.receiptAmount : `-${list.receiptAmount}`;
                return (
                    <div key={index}>
                        <WingBlank style={{display:isShowY}}>
                            <div styleName="yearTip">
                                <span>{year}年</span>
                            </div>
                        </WingBlank>
                        <div styleName="bill-item">
                            <div styleName="time">
                                <div>{day}</div>
                                <div>{time}</div>
                            </div>
                            <div styleName={cls1}></div>
                            <div styleName="info">
                                <div styleName={cls2}>{list.payType=='1'? '+':null}{tools.thousands_separators(receiptAmount)}</div>
                                <div>{list.shopName}</div>
                            </div>
                        </div>
                    </div>
                )
            })
        }else{
            return <div styleName="noData">暂无数据</div>
        }
    }

    render(){
        const {noMoreData} = this.state;
        console.log('noMoreData',noMoreData);

        return(
            <Scroller
                useLoadMore={!noMoreData}
                loadMoreAction={this.loadMoreAction}
                noMoreData={noMoreData}
            >
                <div styleName="mybills">
                    <div styleName="top">
                        <span>最近100条交易信息</span>
                        <Icon styleName="icon-right" type="right" />
                        <span onTouchStart={this.goBillReports}>报表</span>
                    </div>
                    <div styleName="content">
                        {this.getContent()}
                    </div>
                </div>
            </Scroller>
        )
    }
}


export default MyBills;
