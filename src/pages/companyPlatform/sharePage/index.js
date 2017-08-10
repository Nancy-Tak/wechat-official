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
import ShareTips from 'ASSETS/images/shares.png'


export default class SharePage extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        tools.setDocumentTitle('推荐服务');
        this.state = {
            codeImg: '',
            shopName:'',
            id: this.props.location.query.id,
        }
    }

    componentWillMount() {
        this.needCodeImg();
    }

    needCodeImg = () => {
        const id = this.state.id;
        axios
            .get('/api/shopassistant/shareinfo/' + id)
            .then(res => {
                console.log('res.data.shopName===>',res.data.shopName)
                const qrcode_img = res.data.qrcodeImg;
                const shopName = res.data.shopSimpleName ;
                this.setState({
                    codeImg: qrcode_img,
                    shopName:shopName,
                })
            })
    }

    render() {
        console.log(this.state.codeImg);
        console.log(this.state.shopName)
        console.log(this.state.id);
        console.log(this.props.location)
        console.log(window.location.href)
        return (
            <div>
                    <div className="shopFs28">
                        <div styleName="bigBackground"></div>
                        <div styleName='nancy'>
                            <WhiteSpace size="lg" />
                            {/*<WhiteSpace size="lg" />*/}
                            <div styleName="titleBG">
                            <span styleName="titlepng">
                            <b>{this.state.shopName}</b><br />
                                将您添加为店员
                            </span>
                            </div>
                            <WhiteSpace size="lg" />
                            <div styleName="notice">
                                请按以下步骤绑定微信号，即可获得
                                <br />
                                <b>每笔收款到账实时提醒</b>功能
                            </div>
                            <WhiteSpace size="lg" />
                            <div styleName="notice">
                                1.将以下二维码截图，或保存至相册。
                            </div>
                            <img src={this.state.codeImg} alt="" styleName="coolImg code" style={{ width: "34%" }} />
                            <div styleName="notice">
                                2.打开微信使用“<b>扫一扫</b>”，点击“<b>相册</b>”，<br/>选择保存好的二维码。
                            </div>
                            <img src={require('ASSETS/images/share2s.png')} alt="" styleName="coolImg"
                                 style={{ width: "85%", marginBottom: 0 }} />
                            <WhiteSpace size="lg" />
                            <div styleName="notice">
                                3.点击“<b>关注</b>”公众号，依提示验证身份 <br/> 即可免费开通服务。
                            </div>
                            <img src={require('ASSETS/images/sharestep3.png')} alt="" styleName="coolImg"
                                 style={{ width: "77%", marginBottom: 0 }} />

                        </div>
                     </div>
               }
            </div>
        )


    }
}
