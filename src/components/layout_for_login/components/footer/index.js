import React, {Component} from 'react';
import {Icon} from 'antd-mobile';
import {session} from 'UTILS';
import ShutDownModal from './shutDownModal.js';
import shutDownIcon from 'ASSETS/svg/shutdown.svg';

import './style.less';

class Footer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      shutItDownVisible: false
    }
    this.setTime = null;
  }

  shutItDownVisible = () => {
    this.setState({shutItDownVisible: true});
  }

  shutItDownDisable = () => {
    this.setState({shutItDownVisible: false});
  }

  setNowFormatDate = () => {
    let me = this;
    const userInfo = session.getUserInfo();
    if (userInfo && userInfo.userName) {
      me.setTime = null;
      const getNowFormatDate = () => {
        let date = new Date();
        let seperator1 = "-";
        let seperator2 = ":";
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
        document.getElementById("showDate").innerHTML = currentdate;
      }
      me.setTime = setInterval(getNowFormatDate, 1000);
    } else {
      return false
    }
  }

  componentDidMount() {
    this.setNowFormatDate();
  }

  componentWillUnmount() {
    clearInterval(this.setTime);
  }

  render() {

    const {shutItDownVisible} = this.state;

    let tel = (
      <span styleName="tel">
        客服热线：95039
      </span>
    );

    const userInfo = session.getUserInfo();

    let shutDownBtn = (
      userInfo && userInfo.userName
      ?
      (
        <Icon type={shutDownIcon} styleName="shutdown" onClick={this.shutItDownVisible}/>
      )
      : null
    );

    let time = (
      userInfo && userInfo.userName
      ?
      (
        <div styleName="left">
          <span id="showDate"></span>
        </div>
      )
      : null
    );

    let ShutDown = (
      shutItDownVisible
      ?
      (
        <ShutDownModal visible={shutItDownVisible} onClick={this.shutItDownDisable}/>
      )
      : null
    );

    return (
      <div styleName="footer-wrap">
        <div styleName="footer">
          <div styleName="right">
            {shutDownBtn}
            {tel}
          </div>
          {time}
        </div>
        {ShutDown}
      </div>
    );
  }
}

export default Footer
