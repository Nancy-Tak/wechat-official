import React, { Component } from 'react';
import { Link } from 'react-router';
import { Toast,Icon } from 'antd-mobile';
import { session } from 'UTILS';
import './style.less';
import accountIcon from 'ASSETS/svg/account.svg';

class Header extends React.Component {
	render() {
    const { merchantName } = session.getUserInfo();

		const onHeaderRight = merchantName ? (
			<Link styleName="onHeaderRight" to="/account">
				<span styleName="stringOnHeaderRight">
					您好，{merchantName}
          <div styleName="accountIcon"></div>
          {/* <Icon
						type={accountIcon}
            size='md'
            style={{
              verticalAlign: 'middle',
              marginLeft: '10px'
            }}
					/> */}
				</span>
			</Link>
		) : null;

		return (
			<div styleName="header-wrap">
				<div styleName="header">
					<img src={require('ASSETS/images/logo.png')} styleName="logo"/>
					<span styleName="stringAfterLogo">企业的桌面银行</span>
					  { onHeaderRight }
			    </div>
			</div>
		);
	}
}

export default Header;
