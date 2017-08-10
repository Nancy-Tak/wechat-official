import React from 'react';
import { withRouter } from 'react-router'
import {
    NavBar,Tabs, WhiteSpace
} from 'antd-mobile';
import { createForm } from 'rc-form';
import { axios, session,tools } from 'UTILS';
import {SearchBar,List,Flex,Toast} from 'antd-mobile';

import './style.less'
import store from 'store';

const Item = List.Item;

class PayerSelect extends React.Component {
    constructor(props) {
        tools.setDocumentTitle('选择付款人');
        super(props);
        this.state = {
            gatherList: [],
            isLoading: false,
        };
        this.pageNum = 1;
        this.keyword = '';

        this.timer = null;
        this.timer2 = null;
    }

    componentWillMount() {
        //this.searchProps();
    }

    componentDidMount() {

        this.renderTopHeight();
        //默认进来先请求一遍
        this.getPayerList('',1);

    }

    //离开时，清除定时器
    componentWillUnmount() {
        this.timer2 && clearInterval(this.timer2);
        this.timer2 = false;
    }

    renderTopHeight = ()=> {
        setTimeout(()=> {
            let body = document.getElementsByClassName("setMoney")[0].offsetHeight;

            let header =document.getElementById('searchDiv').offsetHeight;
            let headerNote = document.getElementsByClassName('selectPerson')[0].offsetHeight;
            console.log('body',body);
            console.log('header',header);
            console.log('headerNote',headerNote);
            let listContentH=body-header- headerNote;
            this.setState({
                getHeight: listContentH
            })
        }, 0);
    }


    //跳转回金额页面
    goMoney = (item)=> {
        const {router} = this.props;
        console.log('传参', item);
        router.push({
            pathname: '/cashierCenter/setAmount',
            query: {gatherName: item.name, gatherId: item.id}
        });
    }
    //搜索列表数据
    getPayerList(value, page) {
        console.log('page:',page);
        this.pageNum=page;
        this.keyword = value;
        let requestData = {
            name: value,
            pageNum: page,
            pageSize: 20
        };
        this.setState({
            isLoading: true
        });
        axios.post('/api/b/payment/payers/search', requestData).then(res => {
            let data = [];
            console.log('res.data.list:', res.data.list);
            let resList = res.data.list || [];
            if (res.data.pageNum > 1) {
                data = this.state.gatherList.concat(resList);
            } else {
                data = resList
            }
            this.setState({
                gatherList: data,
                isLoading: false,
                noMore: data.length >= res.data.total,
            });

        }).catch(error => {
            console.log(error);
            Toast.fail(error.message, 2);
        });
    }
    //点击删除图标时，使输入框失焦
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
    //上拉加载更多
    onScroll() {
        console.log('enter scroll')
        if (this.state.isLoading == true || this.state.noMore == true) {
            return;
        }
        if (parseInt(this.refs.lv.style.height) + this.refs.lv.scrollTop >= this.refs.lv.scrollHeight) {
            this.pageNum++;
            this.getPayerList(this.keyword, this.pageNum);
        }
    }

    render() {
        console.log('render:',this.state.gatherList);
        return (
            <div className="setMoney">
                <div id="searchDiv">
                    <SearchBar placeholder="输入付款人名称搜索" onClear={this.onHandleClear}
                               onBlur={this.HolderCenter} 
                               onFocus={this.HolderLeft}
                               onSubmit={(value)=>{this.getPayerList(value,1)}} autoFocus
                               onCancel={()=>{this.goMoney({name:'',id:''})}}/>
                </div>
                <div id='salesList'>
                     <div className="selectPerson">选择付款人</div>
                    <ul className="list" style={{height:this.state.getHeight,overflow: 'auto'}}
                        ref="lv" onScroll={this.onScroll.bind(this)}>

                        {this.state.gatherList && this.state.gatherList.map((item, index) => (
                            <li key={index} onClick={()=>{this.goMoney(item)}}>
                                {item.name}
                            </li>
                        ))}
                        {this.state.isLoading ? <li style={{textAlign: 'center',fontSize:'32px',lineHeight:'40px',padding:'0'}}>正在加载中...</li>: null}
                        {this.state.noMore ? <li style={{textAlign: 'center',fontSize:'32px',lineHeight:'40px',padding:'0'}}>没有更多数据了</li>: null}

                    </ul>
                </div>
            </div>
        );
    }
}
export default PayerSelect;

