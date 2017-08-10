import {Toast} from 'antd-mobile';
import {browserHistory, hashHistory} from 'react-router';
import axios from 'axios';
import session from '../utils/session';
import store from 'store';

// default axios config
axios.default.withCredentials = true;
axios.default.timeout = 5000;

// 后端接口状态码
// (5004, "sessionId过期")
// (0, "失败。")
// (1, "成功。")
axios.interceptors.response.use(
    response => {
        const { data = {} } = response;
        Toast.hide();
        switch (data.status) {
            case 1:
            {
                return data;
                // return Promise.reject(data);
            }
            case 0:
            {
                Toast.fail(data.message, 3);
                // return data;
                return Promise.reject(data);
            }
            case 5004:
            {
                Toast.fail(`(${data.status})${data.message}`, 3);
               // window.location.href = "#/companyLogin";
               browserHistory.push('/companyLogin');
                return Promise.reject(data);
            }
            case 5005:
            {
                Toast.fail(`网络超时，请稍后再试`, 3);
                return Promise.reject(data);
            }
            case 500810001:
            {
                Toast.fail(`页面超时，请重新提交`, 3);
                browserHistory.push('/companyLogin');
              //  window.location.href = "#/companyLogin";
                let data={
                    message:'页面超时，请重新提交',
                    status:1
                }
                return Promise.reject(data);
            }
            default:
            {

                Toast.fail(`${data.message}`, 3);
                return Promise.reject(data);
            }
        }
    },
    error => {
        Toast.hide();
        if (process.env.IS_DEV) {
            console.log('axios error', error);
        }

        if(error=='Error: Network Error'){
        	error='网络异常，请检查网络后重试'
        }else if(error=='(undefine)Network Error'){
        	error='网络异常，请检查网络后重试'
        }
        let data={
        	message:error,
        	status:-999
        };
        return Promise.reject(data);
    }
);

// http request 拦截器
axios.interceptors.request.use(
    config => {
        //console.log('axios.config:',config);
        let sessionId=store.get('SESSIONID');
        if(sessionId){
            config.headers.sessionId = sessionId;
        }
        let openId=store.get('OPPENID');
        if(openId){
            config.headers.openId = openId;
        }
        if(!config.isHideLoding){
            Toast.loading('加载中...', 999);
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

export default axios;
