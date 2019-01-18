import React from 'react';
import { Table, Icon } from 'antd';
import {Link} from 'react-router-dom';
const listColumns = [{
  title: 'DevSN',
  dataIndex: 'DevSN',
  key: 'DevSN',
  render:text=><Link to={`devices/${text}`}>{text}</Link>
}, {
  title: 'Time',
  dataIndex: 'Time',
  key: 'Time',
}];
const ListTable = (data,boo)=>{
  return(
      <Table columns={listColumns} dataSource={data} pagination={boo} expandedRowRender={record=><div>{record.description}</div>} />
  );
};

export default ListTable;