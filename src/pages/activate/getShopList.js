import React from 'react';
import {
    Toast,List,Tabs
} from 'antd-mobile';
import store from 'store';
import { axios, tools,ruleType} from 'UTILS';
import './shopList.less';
import classnames from 'classnames';

class ShopList extends React.Component {
    constructor(props) {
        super(props);
        tools.setDocumentTitle('账号激活');
        this.state={
            shopLists:[],
        }
    }

    componentDidMount(){
        //默认查询未激活的列表
        this.getShopList(0);
    }

    /**
     * [getShopList description]
     * @param  {[type]} status [状态,false:未激活;1:true]
     * @return {[type]}        [description]
     */
    getShopList=()=>{
        let shopKeyWordObj=store.get('SHOP_KEY_WORD') || {};
        let data={
            phone:shopKeyWordObj.phone || "",
            realName:shopKeyWordObj.name || "",
            //status:false //查询未激活的列表
        };
        axios.post(`/api/activate/list`,data).then((res)=>{
            if(res.status == '1'){
                this.setState({
                    shopLists:this.showShops(res.data),
                })
            }else{
                Toast.fail(`${res.message}`, 2);
            }
        }).catch(error=>{
            Toast.fail(error.message, 2);
        });
    }

    showShops(list){
        const items = [];
        console.log('list.entries():',list.entries());
        for(let [i,shop] of list.entries()){
            let shopLabelCls=classnames({
                shopLabel:true,
                blue:shop.roleCode === 1
            });
            let html=(
                <List.Item key={shop.id} onClick={()=>{this.goNext(shop)}}>
                    <span className="shopBox">
                        {shop.simpleName}
                        <span className={shopLabelCls}>{shop.roleCode==1? '商户' : '门店'}</span>
                    </span>


                </List.Item>
            );

            items.push(html)
        }
        return items;
    }

    goNext(shop){
        const {router} = this.props;
        let shopInfo={
            id:shop.id,
            name:shop.simpleName,
            roleCode:shop.roleCode
        };
        store.set('ACTIVEATE_SHOPINFO',shopInfo);
        router.push('/activate/activateAssistant');
    }

    render() {
        const items = this.state.shopLists;
        if (items.length==0){
            items.push(<List.Item key={-1}>没有门店</List.Item>)
        }
        return (
            <div>
                <div className="choose-title">请选择以下商户/门店激活账号</div>
                <List>
                    {items}
                </List>
            </div>
        )
    }
}

export default ShopList;




