import React from 'react';
import { Route, IndexRoute } from 'react-router';
import {browserHistory} from 'react-router';

import App from './pages/app/App';

//redireact 组件 根据url传过来的信息查询应该跳转到那个页面
import Redireact from './pages/redireact';

import CompanyLogin from './pages/companyLogin';
// import CompanySettleIn from './pages/companySettleIn';
import EnterpriseBasicInfo from './pages/companySettleIn/enterpriseBasicInfo';
import ConnectInfo from './pages/companySettleIn/connectInfo';
 import Balances from './pages/companySettleIn/balances';
import ResultPage from './pages/companySettleIn/resultPage';

// import AddStores from './pages/addStores';
import NewShopBasicInfo from './pages/addStores/shopBasicInfo';
import NewConnectInfo from './pages/addStores/connectInfo';
import NewBalances from './pages/addStores/balances';
import NewResultPage from './pages/addStores/resultPage';
import ShopsDetail from './pages/shopsDetail';
import AccountManage from './pages/accountManage';

//补充资料
import SupplementUser from './pages/companySettleIn/supplementUser';
import SupplementPhone from './pages/companySettleIn/supplementPhone';


//企业平台
import CompanyPlatform from './pages/companyPlatform';

//我的账单
import MyBills from './pages/companyPlatform/myBills';
//账单报表
import BillReports from './pages/companyPlatform/myBills/billReports';

//门店管理
import StoreManagement from './pages/companyPlatform/storeManagement/storeManagement';
//我的二维码
import MyQrcode from './pages/companyPlatform/qrCode/myQrcode';

//二维码
import QrCode from './pages/companyPlatform/qrCode';

import Error404 from 'PAGES/404';

// 授权入口
import Authorize from './pages/authorize';
import Authorize2 from './pages/authorize/index2.js';
import Jump from './pages/authorize/jump.js';
//店员管理
import SalesManagement from './pages/companyPlatform/salesManagement'
import SalesDetail from './pages/companyPlatform/salesDetail'
import AddSalesMan from './pages/companyPlatform/addSalesMan'
import AddResultPage from './pages/companyPlatform/addResultPage'
import SharePage from './pages/companyPlatform/sharePage'

//收银员个人中心
import CashierCenter from './pages/cashierCenter/index';
import SetAmount from './pages/cashierCenter/setAmount';
import PayerSelect from './pages/cashierCenter/payerSelect';
import TradeComfirm from './pages/cashierCenter/tradeComfirm';
import CashierAccountManage from './pages/cashierCenter/accountManage';
import PaySuccess from './pages/cashierCenter/paySuccess';
import PayFail from './pages/cashierCenter/payError';
import PayNote from './pages/cashierCenter/payNote';

// 激活页
import SearchShopList from './pages/activate/searchShopList';
import ShopList from './pages/activate/getShopList';
import ActivateAssistant from './pages/activate/activateAssistant';
import Verification from './pages/activate/verification';
import ActivateSuccess from './pages/activate/success';
//import GetShopOpenID from './pages/activate/getShopOpenID';

//路由跳转监听
function onRouterChange(previousRoute, nextRoute) {
    console.log('previousRoute:',previousRoute);
    console.log('nextRoute:',nextRoute);

    //if(previousRoute.location.pathname=="/resultPage" && nextRoute.location.pathname=="/balances"){
    //    browserHistory.replace('/companyPlatform');
    //}
    //
    //if(previousRoute.location.pathname=="/newResultPage" && nextRoute.location.pathname=="/newBalances"){
    //    browserHistory.replace('/companyPlatform');
    //}

}
export default(

    <Route path="/" onChange={onRouterChange} component={App}>
        {/*微信授权*/}
        <Route path="authorize" component={Authorize}/>
        <Route path="authorize2" component={Authorize2}/>
        <Route path="jump" component={Jump}/>
        {/*企业登录*/}
        {/*
        <IndexRoute component={Redireact}/>
         */}
        <Route path="/index/:channel" component={Redireact}/>
        <Route path="companyLogin" component={CompanyLogin}/>

        {/*<Route path="companySettleIn" component={CompanySettleIn} />*/}
        <Route path="connectInfo(/:id)" component={ConnectInfo}/>
        <Route path="enterpriseBasicInfo" component={EnterpriseBasicInfo}/>
         <Route path="balances" component={Balances}/>
        <Route path="resultPage(/:id)(/:text)" component={ResultPage}/>

        {/*补充资料*/}
        <Route path='supplementUser' component={SupplementUser}/>
        <Route path='supplementPhone' component={SupplementPhone}/>


        {/*<Route path="addStores" component={AddStores} />*/}
        <Route path="newConnectInfo" component={NewConnectInfo}/>
        <Route path="newShopBasicInfo" component={NewShopBasicInfo}/>
        <Route path="newBalances" component={NewBalances}/>
        <Route path="NewResultPage" component={NewResultPage}/>

        {/*企业平台*/}
        <Route path="companyPlatform" component={CompanyPlatform}/>
        <Route path="companyPlatform">
            {/*我的账单*/}
            <Route path="myBills"  component={MyBills}/>
            <Route path="myBills">
                <Route path="billReports"  component={BillReports}/>
            </Route>
            <Route path="storeManagement" component={StoreManagement}/>

            {/*我的二维码*/}
            <Route path="qrCode" component={QrCode}/>
            <Route path="qrCode" >
                <Route path="myQrcode" component={MyQrcode} />
            </Route>
            {/*门店管理*/}
            <Route path="storeManagement">
                {/*门店详情*/}
                <Route path="shopsDetail" component={ShopsDetail} />
            </Route>


            {/*账户管理*/}
            <Route path="accountManage" component={AccountManage} />

            {/*门店管理*/}
            <Route path="salesManagement" component={SalesManagement} />
            <Route path="addSalesMan" component={AddSalesMan} />
            <Route path="salesDetail" component={SalesDetail} />
            <Route path="addResultPage" component={AddResultPage} />
            <Route path="sharePage" component={SharePage} />
        </Route>

        {/*收款员个人中心*/}
        <Route path="cashierCenter" component={CashierCenter}/>
        <Route path="cashierCenter">
            {/*设置金额*/}
            <Route path="setAmount" component={SetAmount} />
            {/*付款人选择*/}
            <Route path="payerSelect" component={PayerSelect} />
            {/*确认交易*/}
            <Route path="tradeComfirm" component={TradeComfirm} />
            {/*账号管理*/}
            <Route path="accountManage" component={CashierAccountManage} />
            {/*成功*/}
            <Route path="paySuccess" component={PaySuccess} />
            {/*失败*/}
            <Route path="payFail" component={PayFail} />
            {/*开启通知*/}
            <Route path="payNote" component={PayNote} />
        </Route>

        {/*激活模块*/}
        <Route path="activate">
            <Route path="searchShopList" component={SearchShopList}/>
            <Route path="shopList" component={ShopList}/>
            <Route path="activateAssistant" component={ActivateAssistant}/>
            <Route path="verification" component={Verification}/>
            <Route path="success" component={ActivateSuccess}/>
        </Route>

        <Route path="*" component={Error404}/>
    </Route>
);
