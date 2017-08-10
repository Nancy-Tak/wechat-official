import React from 'react';
import { withRouter } from 'react-router'
/*import {
    NavBar,Tabs, WhiteSpace
} from 'antd-mobile';
import { createForm } from 'rc-form';*/
import { axios, session,tools } from 'UTILS';

import './style.less'
import store from 'store';



class PayError extends React.Component {
    constructor(props) {
        tools.setDocumentTitle('收款结果');
        super(props);
        this.state = {}
    }

    componentWillMount() {
    }



    handleClick = (event) => {
        const {router} = this.props;
        router.push('/cashierCenter');
    }

    render() {

        return (
            <div styleName="pay-result-container error">
                <div styleName="main">
                    <i styleName="icon"></i>
                    <div styleName="status">收款失败</div>
                    <div styleName="info">
                        <p styleName="row reason">收款失败，请联系客服</p>
                        <p styleName="row tips">如用户已扣款，系统将自动退款</p>
                    </div>
                </div>
                <div styleName="button" onClick={this.handleClick}>返回</div>
            </div>
        );
    }
}
export default PayError;
