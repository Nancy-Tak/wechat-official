// 常用工具类

import {
    Toast
} from 'antd-mobile';

const tools = {
    // 隐藏中间部分的手机号码
    hidenPhoneNumber(phoneNumber,num1=3,num2=5) {
        // 手机号码隐藏处理
        if(!phoneNumber) return;
        const reg = new RegExp('(\\d{'+num1+'})(\\d{'+num2+'})(\\d{'+(11-num1-num2)+'})');
        return phoneNumber.replace(reg, '$1*****$3');
    },

    // 根据ua判断是否IE浏览器
    isIEbrowser() {
        const userAgent = navigator.userAgent;
        if (!!window.ActiveXObject || 'ActiveXObject' in window) {
            return true;
        } else if (userAgent.indexOf('Edge') > -1) {
            return true;
        }
        return false;
    },
    //  url添加参数的方法,params为对象
    urlAddParam(url, params) {
        const reg = new RegExp(/\?+/);
        let hadParam = reg.test(url);
        for (const prop in params) {
            const connector = hadParam ? '&' : '?';
            url += `${connector + prop}=${params[prop]}`;
            if (!hadParam) {
                hadParam = true;
            }
        }
        return url;
    },
    // 提交表单，校验出错后，显示第一个不通过校验的信息
    showError(errors) {
        let message = "表单校验错误";
        for (let prop in errors) {
            if (errors[prop] && errors[prop].errors && errors[prop].errors[0] && errors[prop].errors[0].message) {
                message = errors[prop].errors[0].message;
                break;
            }
        }
        Toast.fail(message, 2);
    },
    //设置title
    setDocumentTitle(title){
        document.title = title;
        if (/ip(hone|od|ad)/i.test(navigator.userAgent)) {
            var i = document.createElement('iframe');
            i.src = '/favicon.ico';
            i.style.display = 'none';
            i.onload = function() {
                setTimeout(function(){
                    i.remove();
                }, 9)
            }
            document.body.appendChild(i);
        }
    },
    //获取门店显示状态
    // 商户审核状态,merchantAuditStatus:-1=审核中，1=审核通过，0=审核不通过;
    // 商户启用/禁用状态,merchantStatus:-1=待启用，1=启用，2=禁用;
    // 门店审核状态,auditStatus:-1=审核中，1=审核通过，0=审核不通过;
    // 门店启用/禁用状态,status:-1=待启用，1=启用，2=禁用;
    getShopStatus(merchantAuditStatus,merchantStatus,auditStatus,status){
    	var obj={};

        if(merchantAuditStatus == -1 && merchantStatus == -1){
            if(auditStatus==-1 && status==-1){
                obj={
                    name:'审核中',
                    status:1
                };
            }else if(auditStatus==0 && status==-1){
                obj={
                    name:'审核不通过',
                    status:0
                };
            }else if(auditStatus==1 && status==-1){
                obj={
                    name:'审核中',
                    status:1
                };
            }else{
                obj={
                    name:'---',
                    status:1
                };
            }
        }else if(merchantAuditStatus == 0 && merchantStatus == -1){
            if(auditStatus==-1 && status==-1){
                obj={
                    name:'审核中',
                    status:1
                };
            }else if(auditStatus==0 && status==-1){
                obj={
                    name:'审核不通过',
                    status:0
                };
            }else if(auditStatus==1 && status==-1){
                obj={
                    name:'审核中',
                    status:1
                };
            }else{
                obj={
                    name:'---',
                    status:1
                };
            }
        }else if(merchantAuditStatus == 1 && merchantStatus == -1){
            if(auditStatus==-1 && status==-1){
                obj={
                    name:'审核中',
                    status:1
                };
            }else if(auditStatus==0 && status==-1){
                obj={
                    name:'审核不通过',
                    status:0
                };
            }else if(auditStatus==1 && status==-1){
                obj={
                    name:'审核中',
                    status:1
                };
            }else{
                obj={
                    name:'---',
                    status:1
                };
            }
        }else if(merchantAuditStatus == 1 && merchantStatus == 1){
            if(auditStatus==-1 && status==-1){
                obj={
                    name:'审核中',
                    status:1
                };
            }else if(auditStatus==0 && status==-1){
                obj={
                    name:'审核不通过',
                    status:0
                };
            }else if(auditStatus==1 && status==-1){
                obj={
                    name:'审核中',
                    status:1
                };
            }else if(auditStatus==1 && status==1){
                obj={
                    name:'审核通过',
                    status:2
                };
            }else if(auditStatus==1 && status==2){
                obj={
                    name:'已禁用',
                    status:-1
                };
            }else{
                obj={
                    name:'---',
                    status:1
                };
            }
        }else if(merchantAuditStatus == 1 && merchantStatus == 2){
            if(auditStatus==-1 && status==-1){
                obj={
                    name:'审核中',
                    status:1
                };
            }else if(auditStatus==0 && status==-1){
                obj={
                    name:'审核不通过',
                    status:0
                };
            }else if(auditStatus==1 && status==-1){
                obj={
                    name:'审核中',
                    status:1
                };
            }else if(auditStatus==1 && status==1){
                obj={
                    name:'审核通过',
                    status:2
                };
            }else if(auditStatus==1 && status==2){
                obj={
                    name:'已禁用',
                    status:-1
                };
            }else{
                obj={
                    name:'---',
                    status:1
                };
            }
        }else{
            obj={
                name:'---',
                status:1
            };
        }
        return obj;



		//if(merchantAuditStatus == 1 && merchantStatus == 1 && auditStatus == 0) {
		//	obj={
		//		name:'审核不通过',
		//		status:0
		//	};
		//} else if(merchantAuditStatus == 1 && merchantStatus == 1 && auditStatus == 1 && status == 1) {
        //
		//	obj={
		//		name:'审核通过',
		//		status:2
		//	};
		//	//过了
		//} else if(merchantAuditStatus == 1 && merchantStatus == 1 && auditStatus == 1 && status == 2) {
        //
		//	obj={
		//		name:'已禁用',
		//		status:-1
		//	};
		//} else {
        //
		//	obj={
		//		name:'审核中',
		//		status:1
		//	};
		//}

    },
    //身份证号合法性验证
    //支持15位和18位身份证号
    //支持地址编码、出生日期、校验位验证
    testIdCard(code){
        var city = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
        var tip = "";
        var pass = true;

        if(!code){
            tip = "请填写身份证号";
            pass = false;
        }

        if(!/^\d{17}[\dx]$/i.test(code)){
            tip = "身份证号格式错误";
            pass = false;
        }

        else if(!city[code.substr(0,2)]){
            tip = "地址编码错误";
            pass = false;
        }
        else {
            //18位身份证需要验证最后一位校验位
            if(code.length == 18){
                code = code.split('');
                //∑(ai×Wi)(mod 11)
                //加权因子
                var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                //校验位
                var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                var sum = 0;
                var ai = 0;
                var wi = 0;
                for (var i = 0; i < 17; i++) {
                    ai = code[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                var last = parity[sum % 11];
                if(parity[sum % 11] != code[17]){
                    tip = "校验位错误";
                    pass = false;
                }
            }
        }
        return pass;
    },
    // 金额千分位处理
    thousands_separators(number){
        let num=Number(number).toFixed(2);
        num += '';
        var pattern = /^(\+|-)?(\d+)(\d{3})/;
        while(pattern.test(num)){
            num = num.replace(pattern,'$1$2,$3');
        }
        return num;
    }

};

export default tools;

