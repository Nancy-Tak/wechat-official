import React from "react";
import { Link, withRouter } from "react-router";
import {
    NavBar,
    Result,
    Icon,
    WhiteSpace,
    Button,
    Grid,
    Modal,
    Toast
} from "antd-mobile";
import { axios, session, tools } from "UTILS";
import "./success.less";
import store from "store";
import SuccessG from "ASSETS/images/sucessG.png";
import resultTipsShow from "ASSETS/images/resultTipsShow.png";

class ActivateSuccess extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    static propTypes = {
        name: React.PropTypes.string
    };

    constructor(props) {
        super(props);
        tools.setDocumentTitle("账号激活");
        let shopName=store.get('ACTIVEATE_SHOPINFO') && store.get('ACTIVEATE_SHOPINFO').name;
        this.state = {
            shopName:shopName
        };
    }

    goLogin=()=> {
        this.props.router.push('/companyLogin');
    }

    render() {
        const { shopName } = this.state;
        return (
            <div className="activate-success">
                <div>
                    <img className="successPic" src={SuccessG} alt=""/>
                </div>
                <WhiteSpace size="lg"/>
                <div style={{fontSize:30,color:'#666'}}>开通成功</div>
                <WhiteSpace size="lg"/>
                <img className="imgborder" src={resultTipsShow} alt=""/>
                <WhiteSpace size="lg"/>
                <div className="detail">
                    您已成功激活&nbsp;&nbsp;<span className="bold">{shopName}</span>&nbsp;&nbsp;的账号。
                </div>
                <WhiteSpace size="lg"/>
                <img className="imgborder" src={resultTipsShow} alt=""/>
                <WhiteSpace size="lg"/>
                <WhiteSpace size="lg"/>
                <WhiteSpace size="lg"/>
                <Button
                    type="primary"
                    onClick={this.goLogin}
                >
                    马上登录
                </Button>

                <Link className="actvateMore" to="/activate/searchShopList">激活更多</Link>
            </div>
        );
    }
}

export default ActivateSuccess;
