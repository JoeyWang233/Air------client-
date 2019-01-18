import React from 'react';
import { Form, Button, Row, Col, DatePicker, Input, Cascader, Switch,Table } from 'antd';
import socket from '../services/socket.js';
import {Link} from 'react-router-dom';
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
let DevSN;
const columns = [{
  dataIndex: 'DevSN1',
  render: text=><Link to={`latestStatus/${text}`}>{text}</Link>,
},{
  dataIndex: 'DevSN2',
  render: text=><Link to={`latestStatus/${text}`}>{text}</Link>,
},{
  dataIndex: 'DevSN3',
  render: text=><Link to={`latestStatus/${text}`}>{text}</Link>,
},];

class LatestStatus extends React.Component{
  state = {
    DevSN:'',
    data: [],
    pagination: {},
    loading: false,
  };
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  }
  fetch = (params = {DevSN:'',type:0,page:1}) => {
    let lists = []; 
    this.setState({ loading: true });
    socket.emit('status',params);
    socket.once('DevSN',function(data){
      let DevSNs = [];
      for(let index=0;index<data[0].length;index++){
        DevSNs.push(data[0][index].DevSN);
      }
      for(let i=0;i<DevSNs.length;){
        lists.push({
          key:i,
          DevSN1:DevSNs[i++],
          DevSN2:DevSNs[i++],
          DevSN3:DevSNs[i++]
        });
      }
      const pagination = { ...this.state.pagination };
      // Read total count from server
      // pagination.total = data.totalCount;
      pagination.total = data[1];
      this.setState({
        loading: false,
        data: lists,
        pagination,
      });
    }.bind(this));
  }
  handleSearch = (value)=>{
    if(value){
      DevSN = value;
    }else{
      DevSN = '';
    }
    this.fetch({DevSN:DevSN,type:0,page:1});
  }
  handleReset = ()=>{
    document.getElementById('DevSN').value='';
    this.fetch();
  }
  componentDidMount() {
    this.fetch();
  }

  render(){
    return(
      <div>
      <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        <Search id='DevSN' placeholder="Search Name" size="large" onSearch={value=>this.handleSearch(value)} />
      </Col>
      <Col {...ColProps} xl={{ span: 6 }} md={{ span: 8 }} sm={{ span: 12 }}>
          <Button size="large" onClick={this.handleReset}>Reset</Button>
      </Col>
      </Row>
      <Table columns={columns}
        bordered
        showHeader={false}
        dataSource={this.state.data}
        pagination={this.state.pagination}
        loading={this.state.loading}
        onChange={this.handleTableChange}
        />
      </div>
    )
  }  
};

export default LatestStatus;
