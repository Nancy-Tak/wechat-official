import React from 'react';
import { withRouter } from 'react-router'
/*import {
    NavBar,Tabs, WhiteSpace
} from 'antd-mobile';
import { createForm } from 'rc-form';*/
import { axios, session,tools } from 'UTILS';

import './style.less'
import store from 'store';



class PaySuccess extends React.Component {
    constructor(props) {
        tools.setDocumentTitle('收款结果');
        super(props);
        this.state = {
            payerName:'',
            paymentNo:'',
            amount:''
        }
    }

    componentWillMount() {
    }

    componentDidMount(){
        const {payerName,paymentNo,amount} = this.props.location.query;
        this.setState({
            payerName,
            paymentNo,
            amount
        });
    }

    handleClick = (event) => {
        const {router} = this.props;
        router.push('/cashierCenter');
    }


    render() {
        const {payerName,paymentNo,amount} = this.state;
        return (
            <div styleName="pay-result-container success">
                <div styleName="main">
                    <i styleName="icon"></i>
                    <div styleName="status">收款成功</div>
                    <div styleName="info">
                    {
                        payerName ? <p styleName="row">付款人：{payerName}</p> : null
                    }
                        <p styleName="row newline">交易流水号：{paymentNo}</p>
                    </div>
                    <div styleName="other">
                        <div styleName="item-name">收款金额</div>
                        <div styleName="price">{tools.thousands_separators(amount)}</div>
                    </div>
                </div>
                <div styleName="button" onClick={this.handleClick}>完成</div>

            </div>
        );
    }
}
export default PaySuccess;
