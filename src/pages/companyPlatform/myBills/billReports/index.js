import React from 'react';
import { withRouter } from 'react-router';
import { Tabs, WhiteSpace } from 'antd-mobile';
import { axios, tools } from 'UTILS';
import { createForm } from 'rc-form';
import ReactDOM,{findDOMNode} from 'react-dom';
import MonthBillsTab from './monthBills';
import DayBillsTab from './dayBills';
import './style.less'

const TabPane = Tabs.TabPane;

class BillReports extends React.Component {
    render() {
        return (
            <div className="daybills">
                <Tabs defaultActiveKey="1" animated={false}>
                    <TabPane tab="按月统计" key="1">
                        <MonthBillsTab />
                    </TabPane>
                    <TabPane tab="按日统计" key="2">
                        <DayBillsTab />
                    </TabPane>
                </Tabs>
                <WhiteSpace />
            </div>
        )
    }
}

export default BillReports;

