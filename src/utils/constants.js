//门店审核状态
//-1=审核中，1=审核通过，2=审核不通过
const STORE_AUDITSTATUS={
    "-1":'审核中',
    "1":"审核通过",
    "2":"审核不通过"
}

//门店 启用/禁用状态
//-1=待启用，1=启用，2=禁用;
const STORE_USESTATUS={
    "-1":'待启用',
    "1":"启用",
    "2":"禁用"
}

const systemConfig={
    isDev:false
}

export default {STORE_AUDITSTATUS,STORE_USESTATUS,systemConfig};


