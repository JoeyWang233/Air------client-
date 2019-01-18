import React from 'react';
import { Form, Button, Row, Col, DatePicker, Input, Cascader, Switch } from 'antd';
import HandleData from './HandleData.js';
import ListTable from './Table.js';
import moment from 'moment';
import FilterItem from './FilterItem/FilterItem.js';
import socket from '../services/socket.js';
const Search = Input.Search;
const { RangePicker } = DatePicker;
const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
};

const TwoColProps = {
  ...ColProps,
  xl: 96,
};
let deviceData;
let DevSN='',Time,Type='';
var InputText = React.createClass({
    getInitialState : function(){
      socket.emit('list','all');
      this.deviceList();
      return {
        lists:""
      }
    },
    deviceList:function(){
      socket.once('deviceList',function(data){
        let lists = []; 
        if(data !=null){
          let pattern1 = /#(.+) (.+)#/;
          let pattern2 = new RegExp('\\[.+\\]');
          for(let i=data.length-1;i>=0;i--){
            let device = pattern1.exec(data[i]);
            deviceData = data[i].match(pattern2)[0].slice(1,-1);
            let li = {
              key:data.length-i,
              DevSN:device[2],
              Time:device[1],
              Type:deviceData.slice(0,2),
              description:<DeviceInfo/>
            };
            lists.push(li);
          }
          this.setState({
            lists:ListTable(lists)
          });
        }else{
          lists.push(
            <p key='1'>No data</p>
          );
          this.setState({
            lists:lists
          });
        } 
      }.bind(this));
    },
    send:function(){
      socket.emit('list',[DevSN,Time,Type]);
      this.deviceList();
    },
    handleDevSN:function(value){
      if(value){
          DevSN = value;
      }else{
          DevSN = '';
      }
      this.send();
    },
    handleTime : function(value){
        if(value.length){
            Time = value;
        }else{
            Time = '';
        }
        console.log(Time);
        this.send();
    },
    handleType:function(value,selectedOptions){
      if(selectedOptions[0]){
          Type = selectedOptions[0].label;
      }else{
          Type = '';
      }
      this.send();
    },
    handleReset:function(){
        DevSN = '';
        Time = '';
        Type = '';
      socket.emit('list','all');
      this.deviceList();
    },

    // list : function(e){
    //     socket.emit('list',e.target.id);
    //     this.deviceList();
    //     this.setState({
    //       header:""
    //     });
    // },
    // someList : function(e){
    //     let date = moment(e._d).format('YYYY-MM-DD');
    //     socket.emit('list',date);
    //     this.deviceList();
    //     this.setState({
    //       header:""
    //     });
    // },
    render: function(){
      // return (
      //   <div>
      //      <div>
      //           <span><Button id='latest' type='primary' onClick={this.list}>Latest</Button></span>
      //           <span>   </span>
      //           <span><Button id='day' type='primary' onClick={this.list}>Today</Button></span>
      //           <span>   </span>
      //           <span><Button id='week' type='primary' onClick={this.list}>This Week</Button></span>
      //           <span>   </span>
      //           <span><DatePicker id='someday' allowClear={false} onChange={this.someList}/></span>
      //      </div>
      //      <br/>
      //      <hr/>
      //      <br/>
      //      <h2>{this.state.header}</h2>
      //      <div>{this.state.lists}</div>
      //   </div>
      // );
      return (
        <div>
        <Row gutter={24}>
          <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
            <Search placeholder="Search Name" size="large" onSearch={value=>this.handleDevSN(value)} />
          </Col>
          
          <Col {...ColProps} xl={{ span: 6 }} md={{ span: 8 }} sm={{ span: 12 }}>
                <RangePicker style={{ width: '100%' }} size="large" onChange={value=>this.handleTime(value)} />
          </Col>
          <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
              <Cascader
                size="large"
                style={{ width: '100%' }}
                options={[{value:'FA',label:'FA'},{value:'FB',label:'FB'},{value:'FC',label:'FC'},]}
                placeholder="Pick the Type"
                onChange={this.handleType}
              />
          </Col>
          <Col {...TwoColProps} xl={{ span: 10 }} md={{ span: 24 }} sm={{ span: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div >
                {/* <Button type="primary" size="large" className="margin-right" onClick={this.handleSearch}>Search</Button> */}
                <Button size="large" onClick={this.handleReset}>Reset</Button>
              </div>
            </div>
          </Col>
        </Row>
        <br/>
        <hr/>
        <br/>
        <div>{this.state.lists}</div>
        </div>
      )
    }
});


let DeviceInfo = React.createClass({
   decode: function(){
    let dataArray = deviceData.split(' ');
    let HA = new HandleData(dataArray);
    HA.dataDecode(); 
    let i=0;
    let deviceState = [<h4 key='0'>real-time information of {HA.dataFrames.DevSN}</h4>,
                       <h5 key='1'>type of data： {HA.headType}  {HA.dt}</h5>];
    for(let prop in HA.dataFrames){
      i++;
      deviceState.push(<li key={i+2}> {prop}:{HA.dataFrames[prop]}</li>);
    }
    return deviceState;
   },
   render:function(){
     return(
       <div>{this.decode()}</div>
     )
   }
});
const List = ()=>{
    return(
        <InputText/>
    );
};

export default List;

