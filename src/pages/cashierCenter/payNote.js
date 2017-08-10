import React from 'react';
import { withRouter } from 'react-router'
/*import {
    NavBar,Tabs, WhiteSpace
} from 'antd-mobile';
import { createForm } from 'rc-form';*/
import { axios, session,tools } from 'UTILS';

import './style.less'
import store from 'store';



class PayNote extends React.Component {
    constructor(props) {
        tools.setDocumentTitle('开启收款通知');
        super(props);
        this.state = {}
    }

    componentWillMount() {
    }


    render() {

        return (
            <div styleName="pay-Note-wrap">
                <h2 styleName="note-title">轻松2步 开启收款提醒</h2>
                <h4 styleName="note-vice-title">及时收到收款通知，资金到位更放心</h4>
                <div styleName="note-item">
                    <p styleName="note-item-text">
                       <span styleName="step-order">1</span>
                       长按下面二维码，关注“<span styleName="QR-name">请付吧</span>”公众号
                    </p>
                    <div styleName="note-QR">
                       <img src={require('ASSETS/images/noteQR.jpeg')}/>
                    </div>
                </div>
                <div styleName="note-item">
                    <p styleName="note-item-text">
                       <span styleName="step-order">2</span>
                       进入收款消息提醒，按提示操作即可
                    </p>
                    <div styleName="note-step">
                       <img src={require('ASSETS/images/noteOperate.png')}/>
                    </div>
                </div>
            </div>
        );
    }
}
export default PayNote;
