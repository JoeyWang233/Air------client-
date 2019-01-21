/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-plusplus */
import React from 'react';
import { Button, Row, Col, Input, Table } from 'antd';
import { Link } from 'react-router-dom';
import socket from '../services/socket.js';

const Search = Input.Search;
const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
};
let DevSN;
const columns = [{
  dataIndex: 'DevSN1',
  render: text => <Link to={`devices/${text}`}>{text}</Link>,
}, {
  dataIndex: 'DevSN2',
  render: text => <Link to={`devices/${text}`}>{text}</Link>,
}, {
  dataIndex: 'DevSN3',
  render: text => <Link to={`devices/${text}`}>{text}</Link>,
}];

class Devices extends React.Component {
  state = {
    DevSN: '',
    data: [],
    pagination: {},
    loading: false,
  };
  componentDidMount() {
    this.fetch();
  }
  /**
   * @param pagination 分页
   * @param filters    筛选
   * @param sorter     排序
   */
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
  /**
   * @param params 是参数，其有默认值 { DevSN: '', type: 0, page: 1 }
   */
  fetch = (params = { DevSN: '', type: 0, page: 1 }) => {
    const lists = [];
    this.setState({ loading: true });
    socket.emit('Props', params);
    socket.once('DevSN', (data) => {

      console.log('emit(Props) once(DevSN)');
      console.log(data);
      
      const DevSNs = [];
      for (let index = 0; index < data[0].length; index += 1) {
        DevSNs.push(data[0][index].DevSN);
      }
      for (let i = 0; i < DevSNs.length;) {
        lists.push({
          key: i,
          DevSN1: DevSNs[i++],
          DevSN2: DevSNs[i++],
          DevSN3: DevSNs[i++],
        });
      }
      const pagination = { ...this.state.pagination };
      // Read total count from server
      // pagination.total = data.totalCount;
      pagination.total = data[1];
      this.setState({
        /* 改变state，改变之后即可渲染页面 */
        loading: false,
        data: lists,
        pagination,
      });
    });
  }
  handleSearch = (value) => {
    if (value) {
      DevSN = value;
    } else {
      DevSN = '';
    }
    this.fetch({ DevSN, type: 0, page: 1 });
  }
  handleReset = () => {
    document.getElementById('DevSN').value = '';
    this.fetch();
  }

  render() {
    return (
      <div>
        {/* gutter：格栅间隔 */}
        <Row gutter={24}>
          <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
            <Search id="DevSN" placeholder="Search Name" size="large" onSearch={value => this.handleSearch(value)} />
          </Col>
          <Col {...ColProps} xl={{ span: 6 }} md={{ span: 8 }} sm={{ span: 12 }}>
            <Button size="large" onClick={this.handleReset}>Reset</Button>
          </Col>
        </Row>
        <Table
        /**
         * loading：页面是否加载中。
         * onChange：分页、排序、筛选变化时触发
         */
          columns={columns}
          bordered
          showHeader={false}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default Devices;
