import React from 'react';
import { Link, withRouter } from 'react-router'
import {
    NavBar,Result, Icon, WhiteSpace, Button, Grid
} from 'antd-mobile';
import { axios, session,tools } from 'UTILS';
import './style.less'
import store from 'store';


const icons = [
    'cross-circle-o'
];

const rightIcon = [
    'check-circle'
];
export default class NewResultPage extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);

        tools.setDocumentTitle('添加门店');
        this.state = {
            isSuccess:false,
            message:this.props.location.query.message
        }
    }

    componentWillMount() {
        this.init()
    }
    init(){
        console.log("默认渲染")

        if(this.props.location.query.status==1){
            this.setState({
                isShow:true,
                isSuccess:true,
            })
        } else {
            console.log("失败")
        }
    }

    nextStepClick1 = ( ) => {
        //流程走完，清除本地数据
        console.log(store.get('procecssCode'),'拿到')
        store.remove('procecssCode')
        store.remove('procecssId')
        console.log(store.get('procecssCode'),'again')
        console.log(store.get('procecssId'),'again')
        this.props.router.push(`/companyPlatform`)
    }

    nextStepClick2 = ( ) => {
        this.props.router.push(`/newConnectInfo`)
        console.log(store.get('procecssCode'),'失败，应该没删除吧？')
    }

    render() {

        return (
            <div className="step-wrap" styleName="resultPage">
                        {this.state.isSuccess ?
                            <div className="fn-mt-50">
                                <div className="textAlignCenter">
                                    <Icon
                                    type={rightIcon}
                                    size='lg'
                                    style={{
                                        verticalAlign: 'middle',
                                        marginLeft: '20px',
                                        color:'green',
                                    }}
                                /></div>
                                <h1 className="textAlignCenter">提交成功</h1>
                                <div className="textAlignCenter">
                                    {this.state.message=='null' ? '' : this.state.message}
                                </div>

                                <WhiteSpace size='md'/>

                                <div styleName="btn-container">
                                    <Button className="stepBtn" styleName="btn" type="primary" onClick={this.nextStepClick1}>完成</Button>
                                </div>
                            </div>
                            :
                            <div className='fn-mt-50'>
                                <div className="textAlignCenter">
                                    <Icon
                                        type={icons}
                                        size='lg'
                                        style={{
                                            verticalAlign: 'middle',
                                            marginLeft: '20px',
                                            color:'red',
                                        }}
                                    />
                                </div>
                                <h1 className='textAlignCenter'>提交失败</h1>
                                <div styleName="wrongTips" >
                                    请核对并修改以下信息后重新提交
                                </div>
                                <div styleName="wrongCon">
                                    <div styleName="wrongTitle">您提交的内容有如下错误：</div>
                                    <div>
                                        <div styleName="slogo">
                                            <Icon
                                                type={icons}
                                                size='xs'
                                                style={{
                                                    verticalAlign: 'middle',
                                                    marginLeft: '30px',
                                                    color:'red',
                                                }}
                                            />
                                        </div>
                                        <div styleName="wrongMessage">{this.state.message}</div>
                                    </div>
                                </div>
                                <WhiteSpace size='md'/>
                                <div styleName="btn-container">
                                    <Button className="stepBtn" styleName="btn" type="primary" onClick={this.nextStepClick2}>返回修改</Button>
                                </div>
                            </div>
                        }
            </div>
        );
    }
}
