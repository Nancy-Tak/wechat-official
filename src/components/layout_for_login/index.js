import React from 'react'
import {withRouter} from 'react-router';
import Header from './components/header';
import Footer from './components/footer';

import './style.less';

class LayoutForLogin extends React.Component {

  render() {
    return (
      <div styleName="layoutForLogin">
        {/* 头部 */}
        <Header/> {/* 主内容区 */}
        {this.props.children}
        {/* 页脚 */}
        <Footer/>
      </div>
    );
  }
}

export default withRouter(LayoutForLogin);
