/* eslint-disable max-len */
/* eslint-disable no-plusplus */
import React from 'react';
import { Button, Row, Col, DatePicker, Input, Table } from 'antd';
import { Link } from 'react-router-dom';
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
const columns = [{
  title: 'DevSN',
  dataIndex: 'DevSN',
  render: text => <Link to={`parms/${text}`}>{text}</Link>,
}, {
  title: 'Time',
  dataIndex: 'Time',
  sorter: true,
}];
let DevSN = '';
let Time = '';
class List extends React.Component {
  state = {
    timeValue: [],
    data: [],
    pagination: {},
    loading: false,
  };
  componentDidMount() {
    this.fetch();
  }
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      type: '1',
      DevSN,
      Time,
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  }
  fetch = (params = { type: '0' }) => {
    this.setState({ loading: true });
    socket.emit('mclist', params);
    socket.once('deviceMcList', (data) => {
      const lists = [];
      for (let index = 0; index < data[0].length; index++) {
        const description = [];
        const props = [];
        for (const prop in data[0][index]) {
          props.push(`${prop}:${data[0][index][prop]}`);
        }
        for (let i = 0; i < props.length;) {
          description.push(<tbody key={i}>
            <tr>
              <td>{props[i++]}</td>
              <td>{props[i++]}</td>
              {/* <td>{props[++i]}</td> */}
            </tr>
          </tbody>);
        }
        const li = {
          key: index,
          DevSN: data[0][index].DevSN,
          Time: data[0][index].EventTime,
          description: <DeviceInfo value={description} />,
        };
        lists.push(li);
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
    });
  }
  handleDevSN = (value) => {
    if (value) {
      DevSN = value;
    } else {
      DevSN = '';
    }
    this.fetch({
      type: '2',
      DevSN,
      Time,
    });
  }
  handleTime = (value) => {
    this.setState({ timeValue: value });
    if (value.length) {
      Time = [value[0].format('YYYY-MM-DD'), value[1].format('YYYY-MM-DD')];
    } else {
      Time = '';
    }
    this.fetch({
      type: '2',
      DevSN,
      Time,
    });
  }
  handleReset = () => {
    DevSN = '';
    Time = '';
    document.getElementById('DevSN').value = '';
    this.setState({ timeValue: [] });
    this.fetch();
  }
  render() {
    return (
      <div>
        <Row gutter={24}>
          <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
            <Search id="DevSN" placeholder="Search DevSN" size="large" onSearch={value => this.handleDevSN(value)} />
          </Col>

          <Col {...ColProps} xl={{ span: 6 }} md={{ span: 8 }} sm={{ span: 12 }}>
            <RangePicker value={this.state.timeValue} style={{ width: '100%' }} size="large" onChange={value => this.handleTime(value)} />
          </Col>
          {/* <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
              <Cascader
                size="large"
                style={{ width: '100%' }}
                options={[{value:'FA',label:'FA'},{value:'FB',label:'FB'},{value:'FC',label:'FC'},]}
                placeholder="Pick the Type"
                onChange={this.handleType}
              />
          </Col> */}
          <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div >
                {/* <Button type="primary" size="large" className="margin-right" onClick={this.handleSearch}>Search</Button> */}
                <Button size="large" onClick={this.handleReset}>Reset</Button>
              </div>
            </div>
          </Col>
        </Row>
        <br />
        <hr />
        <br />
        {/* <div>{this.state.lists}</div> */}
        <Table
          columns={columns}
          scroll={{ y: 300 }}
        // rowKey={record => record.registered}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
          expandedRowRender={record => <div>{record.description}</div>}
        />
      </div>
    );
  }
}
const DeviceInfo = React.createClass({
  render() {
    return (
      <table width="800">{this.props.value}</table>
    );
  },
});

module.exports = List;
