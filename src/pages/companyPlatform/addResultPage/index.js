import React from 'react';
import { Link, withRouter } from 'react-router'
import {
	NavBar, Result, Icon, WhiteSpace, Button, Grid, Modal,Toast
} from 'antd-mobile';
import { axios, session, tools } from 'UTILS';
import './style.less'
import store from 'store';
import Img from 'ASSETS/images/mask.png'
import SuccessG from 'ASSETS/images/sucessG.png';
import ShareTips from 'ASSETS/images/shares.png';

export default class AddResultPage extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            showYellowPage:'',
            showShare: '',
            message: this.props.location.query.message,
            codeImg: '',
            shopName:'',
            id: this.props.location.query.id,
        }
    }

    componentWillMount() {
        this.init()
    }

    sendMgs=()=>{
        axios.get(`/api/b/shopassistant/` + this.state.id + '/smsnotify')
            .then(res => {
                console.log('sentMgs success 后台知道了~')
            }).catch(error => {
            Toast.fail(error.message, 2);
        });

    }
    init() {
            tools.setDocumentTitle('店员管理');
            this.sendMgs();
    }

    //关闭弹层
    closeShareTips = (e) => {
        e.preventDefault();
        this.setState({
            showShare: 'display-none'
        })
    }

    //微信通知店员
    clickShareBtn = (e) => {
        e.preventDefault();
        this.setState({
            showShare: ''
        })
    }

    //返回店员管理页
    backSalesManage = () => {
        this.props.router.push(`/companyPlatform/salesManagement`)
    }

    render() {
        console.log(this.state.codeImg);
        console.log(this.state.shopName)
        console.log(this.state.id);
        console.log(this.props.location)
        console.log(window.location.href)
        return (
            <div >
                        <div
                            style={{display:"none"}}
                            //className={this.state.showShare}
                            styleName="tancenPic"
                            onClick={this.closeShareTips}
                        >
                            <img
                                style={{
                                    width: '100%',
                                    height: '100%',
                                }}
                                src={Img} alt=""/>
                        </div>

                        <div
                            styleName='successText'
                        >
                            <div>
                                <img
                                    className='fn-mt-30'
                                    styleName='successPic'
                                     src={SuccessG} alt=""/>
                            </div>
                            <WhiteSpace size="lg"/>
                            <div>
                                已发送短信，等待店员确认。
                            </div>
                            <WhiteSpace size="lg"/>
                            <img src={require('ASSETS/images/resultTipsShow.png')} alt=""
                                 style={{ width: "70%", marginBottom: 0 }} />
                            <div>
                                店员确认后即可获得&nbsp;&nbsp;
                                <span styleName="GreenTips">
                                    收款消息
                                    <br/>微信提醒功能。
                                </span>
                            </div>
                            <img src={require('ASSETS/images/resultTipsShow.png')} alt=""
                                 style={{ width: "70%", marginBottom: 0 }} />
                            <WhiteSpace size="lg"/>
                            <WhiteSpace size="lg"/>
                            <div style={{ display:'none',margin: '0 auto'}}>
                                <img
                                    styleName='sharePic'
                                      src={ShareTips} alt=""/>
                            </div>
                            <div styleName="btn-container"
                                 className='step-wrap'
                            >
                                <WhiteSpace size="md"/>
                                <Button
                                    style={{
                                        display:'none',
                                        minWidth: '200px'
                                    }}
                                    className="stepBtn"
                                    styleName="btn"
                                    type="primary"
                                    onClick={this.clickShareBtn}
                                >微信通知店员</Button>
                                <Button
                                    style={{
                                        minWidth: '200px'
                                    }}
                                    className="stepBtn"
                                    styleName="btn"
                                    type="primary"
                                    onClick={this.backSalesManage}
                                >返回店员管理</Button>
                            </div>
                        </div>
                    </div>
        )


    }
}
