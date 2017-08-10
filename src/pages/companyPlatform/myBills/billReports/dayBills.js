import React from 'react';
import { withRouter } from 'react-router';
import { Tabs, WhiteSpace } from 'antd-mobile';
import { axios, tools } from 'UTILS';
import { createForm } from 'rc-form';
import ReactDOM,{findDOMNode} from 'react-dom';
import './style.less'

class DayBillsTab extends React.Component{
    constructor(props){
        super(props);
           tools.setDocumentTitle('按日统计');
        this.state={
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
                        
                            {lists[index].year != new Date().getFullYear() ? <h4 className="monthNum"> <span>{list.year}年</span>{list.month}月</h4> : <h4 className="monthNum">{list.month}月</h4> }
                            <div className="list flex pL32">
                                <div className="month">{list.day}</div>
                                <div className="flex1">
                                    <p>总交易额 <span>{list.totalAmount} </span></p>
                                    <p>总交易笔数 <span>{list.totalOrderNum} </span></p>
                                </div>
                            </div>
                        </div>
                    )
                }else{
                    return(
                        <div key={`list${index}`}>
                            {lists[index].year != lists[index-1].year ? <h4 className="monthNum"> <span>{list.year}年</span>{list.month}月</h4> : (list.month != lists[index-1].month ? <h4 className="monthNum">{list.month}月</h4> : null)}

                            <div className="list flex pL32">
                                <div className="month">{list.day}</div>
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
        axios.get('/api/b/report/day').then(res=>{
            const lists = res.data;
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



    render(){
        return(
            <div style={{ alignItems: 'center', justifyContent: 'center' }}>
                {/*
                <div>
                    <h4 className="monthNum"> <span style={{display:'none'}}>2017年</span>4月</h4>
                    <div className="list flex pL32">
                        <div className="month">08</div>
                        <div className="flex1">
                            <p>总交易额 <span>458,00 </span></p>
                            <p>总交易笔数 <span>120 </span></p>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="monthNum"> <span>2017年</span>4月</h4>
                    <div className="list flex pL32">
                        <div className="month">08</div>
                        <div className="flex1">
                            <p>总交易额 <span>458,00 </span></p>
                            <p>总交易笔数 <span>120 </span></p>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="monthNum"> <span>2017年</span>4月</h4>
                    <div className="list flex pL32">
                        <div className="month">08</div>
                        <div className="flex1">
                            <p>总交易额 <span>458,00 </span></p>
                            <p>总交易笔数 <span>120 </span></p>
                        </div>
                    </div>
                </div>
                 */}
                {this.getContent()}


            </div>
        )
    }
}


export default DayBillsTab;
