import { Table, Button, Icon, Row, Col, Input, DatePicker, Cascader } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import React from 'react';

const ButtonGroup = Button.Group;
const RangePicker = DatePicker.RangePicker;
/* 四个let类型变量对应搜索框内容 */
let DevSN = '';
let Index = [];
let EventTime = [];
let dataType = [];
function Home({ home, dispatch }) {
    /* 列描述数据数组，数组元素为对象；表格的数据源*/
  const columns = [{
      /* title:列头显示文字；
       * dataIndex：列数据在数据项中对应的key
       * render：生成复杂数据的渲染函数
       *    text：参数text代表当前行的值，数据来源于Table组件的dataSource属性
      */
    title: 'DevSN',
    dataIndex: 'DevSN',
    render: text => <Link to={`devices/${text}`}>{text}</Link>,
    width: '25%',
  }, {
    title: 'Index',
    dataIndex: 'Index',
    width: '25%',
  }, {
    title: 'EventTime',
    dataIndex: 'EventTime',
    width: '25%',
  }, {
    title: 'Type',
    dataIndex: 'Type',
    width: '25%',
  }];
  /* 作为<Cascader />组件(级联选择)的属性的值。此部分数据源既可以是静态数据，也可以动态获取。此处是静态数据。 */
  const options = [{
    value: 'Status',
    label: 'Status',
    children: [{
      value: 'Alarm',
      label: 'Alarm',
    }, {
      value: 'Login',
      label: 'Login',
    }],
  }, {
    value: 'McTrans',
    label: 'McTrans',
    children: [{
      value: '128',
      label: '128',
    }, {
      value: '129',
      label: '129',
    }, {
      value: 'other',
      label: 'other',
    }],
  }];
  /**
   * 各个筛选条件选中后的回调
   * @function 每当搜索框中的值发生改变(onChange)，就调用回调来更新state中对应的搜索条件的值
   */
  const handleDevSN = (e) => { DevSN = e.target.value; dispatch({ type: 'home/save', payload: { searchValue: [dataType, DevSN, Index, EventTime] } }); };
  const handleIndex1 = (e) => { Index[0] = e.target.value; dispatch({ type: 'home/save', payload: { searchValue: [dataType, DevSN, Index, EventTime] } }); };
  const handleIndex2 = (e) => { Index[1] = e.target.value; dispatch({ type: 'home/save', payload: { searchValue: [dataType, DevSN, Index, EventTime] } }); };
  const handleTime = (dates) => { EventTime = dates; console.log(EventTime); dispatch({ type: 'home/save', payload: { searchValue: [dataType, DevSN, Index, EventTime] } }); };
  /* "类型" 条件选择完成后的回调 */
  const handleType = (value) => { dataType = value; dispatch({ type: 'home/save', payload: { searchValue: [dataType, DevSN, Index, EventTime] } }); };
  /* 点击 Reset 按钮后的回调 */
  const handleClear = () => {
    dispatch({ type: 'home/clear' });
    DevSN = '', Index = [], EventTime = [], dataType = [];
    dispatch({ type: 'home/search', payload: { DevSN, Index, EventTime, dataType } });
  };
  const handleSearch = () => dispatch({ type: 'home/search', payload: { DevSN, Index, EventTime, dataType } });
  return (
    <div>
      <Row style={{ marginBottom: '10px' }}>
        <Col span={19}>
          <span><Cascader
          /* options: 可选项数据源，object
          *  changeOnSelect：选中即改变
          *  value：指定选中项。此处从./models/home.js中获取数据
          *  onChange：选择完成后的回调
          */
            style={{ width: '125px' }}
            options={options}
            /* 此处也像下面Table一样写成匿名函数也可以 */
            onChange={handleType}
            changeOnSelect
            placeholder={'Select Type'}
            value={home.searchValue[0]}
            size="large"
          />
          </span>
          <span>&nbsp;&nbsp;</span>
          {/* DevSN检索输入框 */}
          <span><Input
            style={{ width: '160px' }}
            placeholder="Input the DevSN"
            onChange={handleDevSN}
            value={home.searchValue[1]}
            size="large"
          /></span>
          <span>&nbsp;&nbsp;</span>
          <span>
            <Input
              style={{ width: '75px' }}
              onChange={handleIndex1}
              disabled={!(home.searchValue[0][0] && home.searchValue[0][1] !== 'Login')}
              placeholder="Start Index"
              value={home.searchValue[2][0]}
              size="large"
            />
            <span> ~ </span>
            <span><Input
              placeholder="End Index"
              onChange={handleIndex2}
              disabled={!(home.searchValue[0][0] && home.searchValue[0][1] !== 'Login')}
              style={{ width: '75px' }}
              value={home.searchValue[2][1]}
              size="large"
            /></span>
          </span>
          <span>&nbsp;&nbsp;</span>
          <span><RangePicker
          /* DatePicker.RangePicker--日期选择组件*/
            style={{ width: '220px' }}
            onChange={handleTime}
            placeholder={['Start EventTime', 'End EventTime']}
            value={home.searchValue[3]}
            size="large"
          /></span>
          <span>&nbsp;&nbsp;</span>
          <span><Button type="primary" onClick={handleSearch} size="large">Search</Button></span>
          <span>&nbsp;&nbsp;</span>
          <span><Button onClick={handleClear} size="large">Reset</Button></span>
        </Col>
        <Col span={5} style={{ textAlign: 'right' }}>
          <ButtonGroup >
            {/* type：UI库提供了四种按钮类型，primary代表主按钮。注意：JSX语法中注释是需要加花括号的*/ }
            <Button type="primary" size="large" onClick={() => { dispatch({ type: 'home/query', payload: { type: 'first', DevSN, Index, EventTime, dataType } }); }}>First</Button>
            <Button type="primary" size="large" onClick={() => { dispatch({ type: 'home/query', payload: { type: 'left', DevSN, Index, EventTime, dataType } }); }}><Icon type="left" /></Button>
            <Button type="primary" size="large" onClick={() => { dispatch({ type: 'home/query', payload: { type: 'right', DevSN, Index, EventTime, dataType } }); }}><Icon type="right" /></Button>
            <Button type="primary" size="large" onClick={() => { dispatch({ type: 'home/query', payload: { type: 'last', DevSN, Index, EventTime, dataType } }); }}>Last</Button>
          </ButtonGroup>
        </Col>
      </Row>
      <Table
      /* dataSource格式定义规则：key自定义，其余值应与columns中dataIndex对应；pagination分页配置；expandedRowRender额外的展开行 */
        columns={columns}
        dataSource={home.data}
        bordered
        pagination={false}
        expandedRowRender={record => <div>{record.description}</div>}
      />
    </div>
  );
}

Home.propTypes = {
  home: PropTypes.object,
  dispatch: PropTypes.func,
};

export default connect(({ home }) => ({ home }))(Home);

