/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-plusplus */
/* eslint-disable no-shadow */
import { Table, Button, Icon, Row, Col, Input, Checkbox, Card } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import React from 'react';

let DevSN = '';
let ifUpgrade = false;
function Upgrade({ upgrade, dispatch }) {
  const handleDelete = (ifUpgrade, DevSN) => {
    dispatch({ type: 'upgrade/delete', payload: { ifUpgrade, DevSN } });
  };
  const upgradeChange = (ifUpgrade, DevSN) => {
    dispatch({ type: 'upgrade/change', payload: { ifUpgrade, DevSN } });
  };
  const editable = upgrade.editable;
  console.log(editable);
  const columns0 = [{
    dataIndex: 'DevSN1',
    width: '25%',
    render: text => (editable[0] ?
      <div style={{ textAlign: 'center' }}>
        <span>{text}</span>
        <span><Icon type="close-circle" onClick={() => handleDelete(1, text)} /></span>
        <span><Icon type="up" onClick={() => upgradeChange(1, text)} /></span>
      </div>
        : <p style={{ textAlign: 'center' }}>{text}</p>),
  }, {
    dataIndex: 'DevSN2',
    width: '25%',
    render: text => <p style={{ textAlign: 'center' }}>{text}</p>,
  }, {
    dataIndex: 'DevSN3',
    width: '25%',
    render: text => <p style={{ textAlign: 'center' }}>{text}</p>,
  }, {
    dataIndex: 'DevSN4',
    render: text => <p style={{ textAlign: 'center' }}>{text}</p>,
  }];
  const columns1 = [{
    dataIndex: 'DevSN1',
    width: '25%',
    render: text => (editable[1] ?
      <div style={{ textAlign: 'center' }}>
        <span>{text}</span>
        <span><Icon type="close-circle" onClick={() => handleDelete(0, text)} /></span>
        <span><Icon type="up" onClick={() => upgradeChange(0, text)} /></span>
      </div>
        : <p style={{ textAlign: 'center' }}>{text}</p>),
  }, {
    dataIndex: 'DevSN2',
    width: '25%',
    render: text => <p style={{ textAlign: 'center' }}>{text}</p>,
  }, {
    dataIndex: 'DevSN3',
    width: '25%',
    render: text => <p style={{ textAlign: 'center' }}>{text}</p>,
  }, {
    dataIndex: 'DevSN4',
    render: text => <p style={{ textAlign: 'center' }}>{text}</p>,
  }];
  const ColProps = {
    xs: 24,
    sm: 12,
    style: {
      marginBottom: 16,
    },
  };
  const handleChange = (e) => {
    DevSN = e.target.value;
  };
  const handleUpgrade = (e) => {
    ifUpgrade = e.target.checked;
  };
  const handleConfirm = () => {
    dispatch({ type: 'upgrade/search', payload: { DevSN, ifUpgrade } });
  };
  const handleReset = () => {
    document.getElementById('DevSN').value = '';
    DevSN = '';
  };
  const handleEdit = (ifUpgrade) => {
    console.log(ifUpgrade);
    if (ifUpgrade) {
      editable[0] = !editable[0];
    } else {
      editable[1] = !editable[0];
    }
    dispatch({ type: 'upgrade/save', payload: { editable } });
  };
  const devicesToUpgrade = upgrade.upgrade;
  const devicesNotToUpgrade = upgrade.notUpgrade;

  const dataSource = [[], []];
  for (let i = 0; i < devicesToUpgrade.length;) {
    dataSource[0].push({
      key: i,
      DevSN1: devicesToUpgrade[i++],
      DevSN2: devicesToUpgrade[i++],
      DevSN3: devicesToUpgrade[i++],
      DevSN4: devicesToUpgrade[i++],
    });
  }
  for (let i = 0; i < devicesNotToUpgrade.length;) {
    dataSource[1].push({
      key: i,
      DevSN1: devicesNotToUpgrade[i++],
      DevSN2: devicesNotToUpgrade[i++],
      DevSN3: devicesNotToUpgrade[i++],
      DevSN4: devicesNotToUpgrade[i++],
    });
  }

  return (
    <div>
      <Row gutter={24}>
        <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
          <Input id="DevSN" placeholder="Search DevSN" size="large" onChange={handleChange} />
        </Col>
        <Col {...ColProps} xl={{ span: 6 }} md={{ span: 3 }}>
          <Checkbox onChange={handleUpgrade}>Upgraded</Checkbox>
        </Col>
        <Col {...ColProps} xl={{ span: 6 }} md={{ span: 2 }}>
          <Button type="primary" size="large" onClick={handleConfirm}>Confirm</Button>
        </Col>
        <Col {...ColProps} xl={{ span: 6 }} md={{ span: 8 }} sm={{ span: 12 }}>
          <Button size="large" onClick={handleReset}>Reset</Button>
        </Col>
      </Row>
      <div style={{ background: '#ECECEC', padding: '30px' }}>
        <Card
          title="Devices To Upgrade"
          extra={<Button onClick={() => handleEdit(1)}>{editable[0] ? 'Confirm' : 'Edit'}</Button>}
          bordered={false}
        >
          <Table
            columns={columns0}
            bordered
            showHeader={false}
            dataSource={dataSource[0]}
            pagination={false}
          />
        </Card>
      </div>
      <br />
      <br />
      <div style={{ background: '#ECECEC', padding: '30px' }}>
        <Card
          title="Devices Not To Upgrade"
          extra={<Button onClick={() => handleEdit(0)}>{editable[1] ? 'Confirm' : 'Edit'}</Button>}
          bordered={false}
        >
          <Table
            columns={columns1}
            bordered
            showHeader={false}
            dataSource={dataSource[1]}
            pagination={false}
          />
        </Card>
      </div>
    </div>
  );
}

Upgrade.propTypes = {
  upgrade: PropTypes.object,
  dispatch: PropTypes.func,
};

export default connect(({ upgrade }) => ({ upgrade }))(Upgrade);
