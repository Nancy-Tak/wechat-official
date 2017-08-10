import React from 'react';
import { withRouter } from 'react-router';
import { Tabs, WhiteSpace,WingBlank,Toast } from 'antd-mobile';
import { axios, tools } from 'UTILS';
import { createForm } from 'rc-form';
import ReactDOM,{findDOMNode} from 'react-dom';
import './style.less'

class MonthBillsTab extends React.Component {
    constructor(props) {
        super(props);
        tools.setDocumentTitle('按月统计');
        this.state = {
            lists: []
        };
    }

    componentDidMount(){
        this.fetchData();
    }

    /**
     * 获取列表内容
     * */
    getContent=()=> {
        if(this.state.lists.length>0){
            return this.state.lists.map((list,index,lists)=>{
                if(index === 0){
                    return(
                        <div key={`list${index}`}>
                            <div className="list flex pL32">
                                <div className="month">{list.month}月</div>
                                <div className="flex1">
                                    <p>总交易额 <span>{tools.thousands_separators(list.totalAmount)} </span></p>
                                    <p>总交易笔数 <span>{list.totalOrderNum} </span></p>
                                </div>
                            </div>
                        </div>
                    )
                }else{
                    return(
                        <div key={`list${index}`}>
                            <WingBlank style={{display:lists[index].year != (lists[index-1] && lists[index-1].year) ? 'block' : 'none' }}>
                                <div className="yearTip">
                                    <span>{list.year}年</span>
                                </div>
                            </WingBlank>
                            <div className="list flex pL32">
                                <div className="month">{list.month}月</div>
                                <div className="flex1">
                                    <p>总交易额 <span>{tools.thousands_separators(list.totalAmount)} </span></p>
                                    <p>总交易笔数 <span>{list.totalOrderNum} </span></p>
                                </div>
                            </div>
                        </div>
                    )
                }

            })
        }else{
            return <div className="noData">暂无数据</div>
        }
    }

    /**
     * 获取数据
     * */
    fetchData=()=> {
        axios.get('/api/b/report/months').then(res=>{
            const lists = res.data || [];
            this.setState({
                lists: lists
            });
        }).catch(error=>{
            Toast.fail(error.message, 2);
        });
    }

    /**
     * 下拉刷新动作
     * */
    pullRefreshAction=()=> {
        setTimeout(() => {
            this.fetchData();
        }, 2000);
    }



    render() {
        return (

                <div style={{ alignItems: 'center', justifyContent: 'center' }}>
                    {this.getContent()}
                    {/*
                     <div>
                         <WingBlank style={{display:'none'}}>
                            <div className="yearTip">
                                <span>2016年</span>
                            </div>
                         </WingBlank>
                         <div className="list flex pL32">
                            <div className="month">4月</div>
                            <div className="flex1">
                                <p>总交易额 <span>190,000.00 </span></p>
                                <p>总交易笔数 <span>1000 </span></p>
                            </div>
                         </div>
                     </div>

                     <div>
                     <WingBlank style={{display:'block'}}>
                     <div className="yearTip">
                     <span>2016年</span>
                     </div>
                     </WingBlank>
                     <div className="list flex pL32">
                     <div className="month">4月</div>
                     <div className="flex1">
                     <p>总交易额 <span>190,000.00 </span></p>
                     <p>总交易笔数 <span>1000 </span></p>
                     </div>
                     </div>
                     </div>
                     <div>
                     <WingBlank style={{display:'none'}}>
                     <div className="yearTip">
                     <span>2016年</span>
                     </div>
                     </WingBlank>
                     <div className="list flex pL32">
                     <div className="month">4月</div>
                     <div className="flex1">
                     <p>总交易额 <span>190,000.00 </span></p>
                     <p>总交易笔数 <span>1000 </span></p>
                     </div>
                     </div>
                     </div>
                     */}
                </div>


        )
    }
}


export default MonthBillsTab;
