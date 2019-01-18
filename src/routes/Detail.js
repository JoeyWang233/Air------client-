/* eslint-disable no-shadow */
/* eslint-disable max-len */
import { Icon, Tag, Button, Table, Row, Col, Pagination } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import ParmsDetail from './ParmsDetail';

const { CheckableTag } = Tag;
const ButtonGroup = Button.Group;
const Detail = ({ detail, parmsDetail, dispatch }) => {
  /* Status定义的4列 */
  const staColumns = [{
    dataIndex: 'prop1',
    width: '15%',
    render: text => <p style={{ fontWeight: 'bold' }}>{text}</p>,
  }, {
    dataIndex: 'value1',
    width: '30%',
  }, {
    dataIndex: 'prop2',
    width: '15%',
    render: text => <p style={{ fontWeight: 'bold' }}>{text}</p>,
  }, {
    dataIndex: 'value2',
  }];
  /* McTrans定义的11列 */
  const mcTColumns = [{
    title: 'C_INDEX',
    dataIndex: 'C_INDEX',
    width: '7%',
  }, {
    title: 'EventTime',
    dataIndex: 'EventTime',
    width: '13%',
    style: { textAlign: 'center' },
  }, {
    title: 'EventCode',
    dataIndex: 'EventCode',
    width: '8%',
  }, {
    title: 'TotalCoin',
    dataIndex: 'TotalCoin',
    width: '7%',
  }, {
    title: 'UserReserve',
    dataIndex: 'UserReserve',
    width: '18%',
  }, {
    title: 'MileAge',
    dataIndex: 'MileAge',
    width: '7%',
  }, {
    title: 'CarNo',
    dataIndex: 'CarNo',
    width: '6%',
  }, {
    title: 'TouchScreen',
    dataIndex: 'TouchScreen',
    width: '9%',
  }, {
    title: 'ServiceType',
    dataIndex: 'ServiceType',
    width: '8%',
  }, {
    title: 'OperationValue',
    dataIndex: 'OperationValue',
    width: '10%',
  }, {
    title: 'ButtonID',
    dataIndex: 'ButtonID',
    width: '7%',
  }];
  /* McTrans定义的6列 */
  const alarmColumns = [{
    title: 'C_INDEX',
    dataIndex: 'C_INDEX',
  }, {
    title: 'SITE_NUMBER',
    dataIndex: 'SITE_NUMBER',
  }, {
    title: 'MACHINE_NUMBER',
    dataIndex: 'MACHINE_NUMBER',
  }, {
    title: 'EVENT_TIME',
    dataIndex: 'EVENT_TIME',
  }, {
    title: 'EVENT_CODE',
    dataIndex: 'EVENT_CODE',
  }, {
    title: 'UserReserve',
    dataIndex: 'UserReserve',
  }];
  const pageSize = 12;
  const parmsProps = {
    DevSN: detail.DevSN,
  };
  return (
    <div>
      <Row style={{ marginBottom: '5px' }}>
        <Col span={6}>
          {/* CheckableTag：组件特征--点击切换选中效果
            * checked：设置标签的选中状态
            * 0-1-3-2：实现点击一个标签，此标签为被选中状态--深色，其余标签没有被选中--浅色
            * onChange中的(checked)是当前标签的选中状态。
            */}
          <CheckableTag checked={detail.checked[0]} onChange={(checked) => { if (checked) { dispatch({ type: 'detail/queryStatus', payload: { DevSN: detail.DevSN, No: detail.statusNo } }); } }} >Status</CheckableTag>
          <CheckableTag checked={detail.checked[1]} onChange={(checked) => { if (checked) { dispatch({ type: 'detail/queryMcTrans', payload: { DevSN: detail.DevSN, page: detail.mcTransNo, pageSize } }); } }}>McTrans</CheckableTag>
          <CheckableTag checked={detail.checked[3]} onChange={(checked) => { if (checked) { dispatch({ type: 'detail/queryAlarm', payload: { DevSN: detail.DevSN, page: detail.alarmNo, pageSize } }); } }}>Alarm</CheckableTag>
          {/* 点击此标签有两个action
            * detail/queryParms：仅将checked状态进行保存；
            * parmsDetail/query：获取 parms tag 要进行展示的数据
          */}
          <CheckableTag checked={detail.checked[2]} onChange={(checked) => { if (checked) { dispatch({ type: 'detail/queryParms', payload: { checked } }); dispatch({ type: 'parmsDetail/query', payload: { DevSN: detail.DevSN } }); } }}>Parms</CheckableTag>
        </Col>
        <Col span={8}>
          <Row>
            <Col span={16} style={{ fontWeight: 'bold', fontSize: '18px' }}>Device: {detail.DevSN}</Col>
            <Col style={{ fontWeight: 'bold', fontSize: '18px' }}>DevID: {detail.constParms.DevID}</Col>
          </Row>
        </Col>
        <Col span={10} style={{ textAlign: 'right' }}>
          {/* 根据不同的tag，页面右上角显示不同的信息。 */}
          { detail.checked[3] ? <Pagination pageSize={pageSize} total={detail.alarmTotalNo} hideOnSinglePage current={detail.alarmNo} onChange={(page, pageSize) => { dispatch({ type: 'detail/queryAlarm', payload: { DevSN: detail.DevSN, page, pageSize } }); }} />
                  : (
                    detail.checked[2] ?
                    /* parms tag */
                   (<Button type="primary" size="large" onClick={() => { dispatch({ type: 'parmsDetail/alter' }); }}>{parmsDetail.alter ? 'Confirm' : 'Alter'}</Button>)
                   : (
                    detail.checked[1] ? <Pagination pageSize={pageSize} total={detail.mcTransTotalNo} hideOnSinglePage current={detail.mcTransNo} onChange={(page, pageSize) => { dispatch({ type: 'detail/queryMcTrans', payload: { DevSN: detail.DevSN, page, pageSize } }); }} />
                   : <ButtonGroup>
                     {/* Status tag */}
                     <Button type="primary" size="large" onClick={() => { dispatch({ type: 'detail/switchStatus', payload: { DevSN: detail.DevSN, type: 'first', No: detail.statusNo } }); }}>First</Button>
                     <Button type="primary" size="large" onClick={() => { dispatch({ type: 'detail/switchStatus', payload: { DevSN: detail.DevSN, type: 'left', No: detail.statusNo } }); }}><Icon type="left" /></Button>
                     <Button type="primary" size="large" onClick={() => { dispatch({ type: 'detail/switchStatus', payload: { DevSN: detail.DevSN, type: 'right', No: detail.statusNo } }); }}><Icon type="right" /></Button>
                     <Button type="primary" size="large" onClick={() => { dispatch({ type: 'detail/switchStatus', payload: { DevSN: detail.DevSN, type: 'last', No: detail.statusNo } }); }}>Last</Button>
                   </ButtonGroup>
                   )
                  )
                }
        </Col>
      </Row>
      <div>
        {detail.checked[2] ? (<ParmsDetail {...parmsProps} />)
            : (<Table
            /**
             * showHeader：是否显示表头？若为status，则不显示。
             */
              columns={detail.checked[0] ? staColumns : (detail.checked[1] ? mcTColumns : alarmColumns)}
              showHeader={!detail.checked[0]}
              dataSource={detail.data}
              pagination={false}
              size="small"
              bordered
              style={{ textAlign: 'center' }}
            />)}
      </div>
    </div>
  );
};
Detail.propTypes = {
  detail: PropTypes.object,
  parmsDetail: PropTypes.object,
  dispatch: PropTypes.func,
};
export default connect(({ detail, parmsDetail, loading }) => ({ detail, parmsDetail, loading: loading.models.detail }))(Detail);
