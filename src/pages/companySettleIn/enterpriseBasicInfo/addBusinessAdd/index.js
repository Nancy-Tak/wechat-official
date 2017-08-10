import React from 'react';
import { withRouter } from 'react-router'
import {
  Button, Flex,List, InputItem,Picker,Toast
} from 'antd-mobile';
import { axios, tools,ruleType } from 'UTILS';
import { createForm } from 'rc-form';
import './style.less';
import store from 'store';

class AddBusinessAdd extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
      super(props);
      this.state={
            // 市/区显隐
          isCity:false,
          isDistrict:false,

          //默认数据
          fValue:[],
          sValue:[],
          tValue:[],

          //rap数据
          allPro:null,
          allCity:null,
          allDistrict:null,
      }
  }

  onChange = (val) => {
    console.log(val);
  }

  nextStepClick = () => {
      console.log('收到表单值：', this.props.form.getFieldsValue());
      this.props.form.validateFields((errors, value) => {
          if (errors) {
              tools.showError(errors);
          } else {
              store.set("address", {
                     pro:value.ProName[0],
                     city:value.CityName[0],
                     area:value.AreaName[0],
                    fullName:value.fullAdd,
                 }
              )
              console.log("保存成功", store.get('address'))
              this.props.closeM()
           }
      })
  }

    //首次
    componentWillMount() {
        this.init()
    }

    init(){
        axios
            .get('/api/area/1')
            .then(res=>{
                console.log("省份数据！！！", res.data)
                //转换数据格式
                const allPro = res.data.map((item)=>{
                    return (
                    {
                        label:item.areaName,
                        value:item.areaCode,
                    }
                    )
                })
                this.setState({
                    allPro
                })
            }) .catch(error=>{
            Toast.fail(`${error.message}`, 3);
        })
    }

    getCity(v){
        axios
            .get('/api/area/'+ v)
            .then(res=>{
                console.log("市数据！！！", res.data)
                //转换数据格式
                const allCity = res.data.map((item)=>{
                    return (
                    {
                        label:item.areaName,
                        value:item.areaCode,
                    }
                    )
                })
                this.setState({
                    allCity,
                    isCity:true
                })
            })
            .catch(error=>{
                Toast.fail(`${error.message}`, 3);
            })
    }

    getDistrict(v){
        axios
            .get('/api/area/'+v )
            .then(res=>{
                console.log("区数据！！！", res.data)
                //转换数据格式
                const allDistrict = res.data.map((item)=>{
                    return (
                    {
                        label:item.areaName,
                        value:item.areaCode,
                    }
                    )
                })
                this.setState({
                    allDistrict,
                    isDistrict: true,
                })

            })
            .catch(error=>{
                Toast.fail(`(${error.status})${error.message}`, 3);
            })
    }

    //省
    onProNameChange = (value)=> {
        console.log("onBankProvinceNameChange",value)
        let proname = null;
        let ProList=this.state.allPro;
        for(let i=0;i<ProList.length;i++){
            if(ProList[i].value==value){
                proname=ProList[i].key;
                store.set('ProText',{
                    ProText:ProList[i].label
                })
            }
        }
        //清空市 和 区 的显示数据
        this.props.form.setFieldsValue({
            CityName:[],
            AreaName:[],
        });
        this.setState({
            proname,
            isCity:true,
            isDistrict:false,
        });
        this.getCity(value)
    }
    //市
    onCityNameChange = (value)=> {
        let cityname = null;
        let cityList=this.state.allCity;
        for(let i=0;i<cityList.length;i++){
            if(cityList[i].value==value){
                cityname=cityList[i].key;

                store.set('CityText',{
                    CityText:cityList[i].label
                })
            }
        }
        // 清除区的显示数据
        this.props.form.setFieldsValue({
            AreaName:[],
        })

        this.setState({
           cityname,
           isDistrict:true,
        });
        this.getDistrict(value)
    }
    onAreaNameChange = (value)=> {
        let areaname = null;
        let areaList=this.state.allDistrict;
        for(let i=0;i<areaList.length;i++){
            if(areaList[i].value==value){
                areaname=areaList[i].key;
                store.set('AreaText',{
                    AreaText:areaList[i].label
                })
            }
        }
        this.setState({
            areaname
        });
        console.log(store.get('AreaText'))
    }

  render() {
      const { getFieldProps, getFieldValue, getFieldError } = this.props.form;
      const fieldProps = {
          ProName: {
              validateTrigger: 'onBlur',
              //initialValue:this.state.reData.provinceId ? [this.state.reData.provinceId] : [],
              rules: [
                  {
                      required: true,
                      message: '省份不能为空'
                  },
                  // {
                  //     pattern: /^\S*$/,
                  //     message: '联系人类型不能为空'
                  // }
              ],
               onChange: this.onProNameChange
          },

          CityName: {
              validateTrigger: 'onBlur',
             // initialValue:this.state.reData.cityId ? [this.state.reData.cityId] : [],
              rules: [
                  {
                      required: true,
                      message: '市不能为空'
                  },
                  // {
                  //     pattern: /^\S*$/,
                  //     message: '联系人类型不能为空'
                  // }
              ],
              onChange: this.onCityNameChange
          },

          AreaName: {
              validateTrigger: 'onBlur',
             // initialValue:this.state.reData.areaId ? [this.state.reData.areaId] : [],
              rules: [
                  {
                      required: true,
                      message: '区不能为空'
                  },
                  // {
                  //     pattern: /^\S*$/,
                  //     message: '联系人类型不能为空'
                  // }
              ],
              onChange: this.onAreaNameChange
          },


          fullAdd: {
              validateTrigger: 'onBlur',
              rules: [
                  {
                      required: true,
                      message: '详细地址不能为空'
                  },
                  {
                      min:1,
                      max:50,
                      message:'请输入1-50位字符'
                  },
                  ruleType('cn+all')
                  // {
                  //     pattern: /^\S*$/,
                  //     message: '不支持输入空格',
                  // },
              ],

          },
      };

      const allPro = this.state.allPro;
      const allCity = this.state.allCity;
      const allDistrict = this.state.allDistrict;
    return (
      <div className="step-wrap  shopFs28">
          <List
              style={{ backgroundColor: 'white',marginTop:'-15px' }} className="picker-list"
          >
              <Picker
                  data={allPro}
                  cols={1}
                  className="forss"
                  extra=" "
                  {...getFieldProps('ProName', fieldProps['ProName'])}
              >
                  <List.Item arrow="horizontal">所在省份</List.Item>
              </Picker>
              {
                  this.state.isCity ?
                  <Picker
                      data={allCity}
                      cols={1}
                      className="forss"
                      extra=" "
                      {...getFieldProps('CityName', fieldProps['CityName'])}
                  >
                      <List.Item arrow="horizontal">所在市</List.Item>
                  </Picker>
                      : null
              }

              {
                  this.state.isDistrict ?
                      <Picker
                          data={allDistrict}
                          cols={1}
                          className="forss"
                          extra=" "
                          {...getFieldProps('AreaName', fieldProps['AreaName'])}
                      >
                          <List.Item arrow="horizontal">所在区</List.Item>
                      </Picker>
                      : null
              }

              <InputItem
                  type="text"
                  {...getFieldProps('fullAdd', fieldProps['fullAdd'])}
              >
                  详细地址
              </InputItem>

          </List>
           <div styleName="btn-container">
              <Button className="stepBtn"  styleName="btn" type="primary" onClick={this.nextStepClick}>保存</Button>
            </div>

      </div>
    );
  }
}
export default createForm()(AddBusinessAdd);
