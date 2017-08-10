// 表单验证规则（for Ant）

// Ant 验证中默认可用的 type 类型有：
//
// string: Must be of type string. This is the default type.
// number: Must be of type number.
// boolean: Must be of type boolean.
// method: Must be of type function.
// regexp: Must be an instance of RegExp or a string that does not generate an exception when creating a new RegExp.
// integer: Must be of type number and an integer.
// float: Must be of type number and a floating point number.
// array: Must be an array as determined by Array.isArray.
// object: Must be of type object and not Array.isArray.
// enum: Value must exist in the enum.
// date: Value must be valid as determined by Date
// url: Must be of type url.
// hex: Must be of type hex.
// email: Must be of type email.

// 自定义数据类型
const dataType = {
    // 任意字符
    any: {
        reg: /[\w\W]+/,
    },
    // 4-20任意字符
    // "*4-20": /^[\w\W]{4,20}$/,
    // 数字
    number: {
        reg: /^\d+$/,
        errMsg: '仅支持数字',
    },
    // 中文
    cn: {
        reg: /^[\u4E00-\u9FA5\uf900-\ufa2d]+$/,
        errMsg: '仅支持中文',
    },
    // 英文/数字组合
    'en-num': {
        reg: {
            // 自定义 test 方法
            test(value) {
                return /[a-zA-Z]+(?=[0-9]+)|[0-9]+(?=[a-zA-Z]+)/.test(value) && 　value.replace(/[a-zA-Z]/g, '').replace(/[0-9]/g, '') === '';
            },
        },
        errMsg: '必须是英文字母、数字组合',
    },
    // 邮政编码
    post: {
        reg: /^[0-9]{6}$/,
        errMsg: '邮政编码格式不正确',
    },
    // 手机
    mobile: {
        // /^(86|\+86)?1(3[0-9]{9}$|47[0-9]{8}$|5[0-9]{9}$|7(0|7)[0-9]{8}$|8[0-9]{9}$)$/
        reg: /^(86|\+86)?1(3[0-9]{9}$|4[0-9]{9}$|5[0-9]{9}$|7[0-9]{9}$|8[0-9]{9}$)$/,
        errMsg: '手机格式不正确',
    },
    // 手机+固话
    'mobile+fixedLine': {
        // reg: /^13[0-9]{9}$|^147[0-9]{8}$|^15[0-9]{9}$|^17(0|1|7)[0-9]{8}$|^18[0-9]{9}$|^[0-9-()（）]{7,18}$/,
        reg: /^(86|\+86)?1(3[0-9]{9}$|4(5|7|9)[0-9]{8}$|5[0-9]{9}$|7(0|1|3|5|6|7|8)[0-9]{8}$|8[0-9]{9}$)|^[0-9-()（）]{7,18}$/,
        errMsg: '手机或固定电话格式不正确',
    },
    // email
    email: {
        reg: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        errMsg: '邮箱格式不正确',
    },
    // url
    url: {
        reg: /^(\w+:\/\/)?\w+(\.\w+)+.*$/,
        errMsg: 'url格式不正确',
    },
    // idcard
    'id-card': {
        reg: /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/,
        errMsg: '身份证号码格式不正确',
    },
    //中文+英文括号
    'cn+brackets': {
        reg: /^[\u4E00-\u9FA5\uf900-\ufa2d\(\)]+$/,
        errMsg: '仅支持中文+半角括号',
    },
    //中文,数字，英文,字母,半角标点-_()
    'cn+all': {
        reg: /^[\u4E00-\u9FA5\uf900-\ufa2d\(\)\-\_A-Za-z0-9]+$/,
        errMsg: '仅支持中文字符、数字、大小写字母、半角标点符号_-()',
    },

    //数字，英文,字母,半角标点-_()
    'num+all': {
        reg: /^[A-Za-z0-9_\(\)\-]+$/,
        errMsg: '仅支持数字、大小写字母、标点符号-_()',
    },

    //中文字符、英文字母（区分大小写）、半角标点符号()
    'cn-all': {
        reg: /^[a-zA-Z\(\)\u4e00-\u9fa5\uf900-\ufa2d]+$/,
        errMsg: '仅支持中文字符、大小写字母、半角标点符号()'
    },

    //中文字符、英文字母（区分大小写）、半角标点符号•·.,-_~*()!@#$%^&
    'cn-num-all': {
        reg: /^[a-zA-Z\u4e00-\u9fa5•·\.\,\-_~\*\(\)!@#\$%\^&]+$/,
        errMsg: '仅支持中文字符、大小写字母、半角标点符号•·.,-_~*()!@#$%^&'
    },

    // 不支持输入空格
    'need-w': {
        reg: /^\S*$/,
        errMsg: '不支持输入空格'
    },

    // 只能是整数
    'need-z': {
        reg: /^\d+$/,
        errMsg: '仅支持整数'
    },
    // 6位数字验证码
    'sms-code': {
        reg: /^\d{6}$/,
        errMsg: '请输入正确的6位数字验证码'
    },

    // 5-30银行卡号
    'bank-card': {
        reg: /^(\d{5,30})$/,
        errMsg: '请输入正确的银行账号'
    },
    // 英文/数字组合5-20位
    'password': {
        reg: {
            // 自定义 test 方法
            test(value) {
                return /[a-zA-Z]+(?=[0-9]+)|[0-9]+(?=[a-zA-Z]+){6,20}/.test(value) && 　value.replace(/[a-zA-Z]{6,20}/g, '').replace(/[0-9]{6,20}/g, '') === '';
            },
        },
        errMsg: '必须是英文字母、数字组合',
    },

    //  英文/数字/符号 组合
    //字母+数字   数字+字母  数字+字符   字符+数字   字母+字符  字符+字母
    // 'en-num-zifu': {
    //     reg: {
    //         test(value) {
    //             return /[a-zA-Z]+(?=[0-9]+)|[0-9]+(?=[a-zA-Z]+)|[0-9]+(?=[.\,\-_~\*\(\)!@#\$%\^&]+)|[.\,\-_~\*\(\)!@#\$%\^&]+(?=[0-9])|[a-zA-Z]+(?=[.\,\-_~\*\(\)!@#\$%\^&]+)|[.\,\-_~\*\(\)!@#\$%\^&]+(?=[a-zA-Z])/.test(value) && 　value.replace(/[a-zA-Z]/g, '').replace(/[0-9]/g, '').replace(/[.\,\-_~\*\(\)!@#\$%\^&]/g, '') === '';
    //         },
    //     },
    //     errMsg: '必须是英文字母/数字/符号两两组合',
    // },

    //中文,数字，英文,字母,半角标点-_()
    cn_all: {
        reg: /^[\u4E00-\u9FA5\uf900-\ufa2d\(\)\-\_A-Za-z0-9]+$/,
        errMsg: '仅支持中文字符、数字、大小写字母、半角标点符号_-()',
    },
    en_num_all: {
        reg: {
            test(value) {
                return /[a-zA-Z]+(?=[0-9]+)|[0-9]+(?=[a-zA-Z]+)|[0-9]+(?=[.\,\-_~\*\(\)!@#\$%\^&]+)|[.\,\-_~\*\(\)!@#\$%\^&]+(?=[0-9])|[a-zA-Z]+(?=[.\,\-_~\*\(\)!@#\$%\^&]+)|[.\,\-_~\*\(\)!@#\$%\^&]+(?=[a-zA-Z])/.test(value) && 　value.replace(/[a-zA-Z]/g, '').replace(/[0-9]/g, '').replace(/[.\,\-_~\*\(\)!@#\$%\^&]/g, '') === '';
            },
        },
        errMsg: '必须是英文字母、数字或符号组合',
    },
    en_num: {
        reg: /^[a-zA-Z0-9]+$/,
        errMsg: '必须只包含英文字母、数字',
    },
};

// 生成 Ant 验证规则 rule
export default function getRule(type, errMsg) {
    const validate = dataType[type];
    if (validate) {
        return {
            validator(rule, value, callback) {
                // console.log(rule)
                if (!value) {
                    callback();
                } else if (!validate.reg.test(value)) {
                    callback([new Error(errMsg || validate.errMsg)]);
                } else {
                    callback();
                }
            },
        };
    }
}
