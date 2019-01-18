/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { connect } from 'dva';
import { InputCell, Time1, Relay, Check, Radio, Time2, InputNumber, Time3, IP } from '../components/AlterParm';

const Detail = ({ parmsDetail, dispatch }) => {
  const radioValue = {
    OperatorSetting: ['Auto', 'Manual', 'Default'],
    NetModeSetting: ['Auto', 'GPRS', 'LAN'],
    GprsConnectMode: ['IP', 'Domain'],
    ParReset: ['N/A', 'Reset Status', 'Reset Status and Parms'],
  };
  const step = {
    TemperatureThreshold1: 0.1,
    TemperatureThreshold2: 0.1,
    PushButtonDelay: 1,
    SumInterval_Type: 1,
    Move_Thre: 1,
    GprsDelayTime: 1,
    TemperatureSensor1: 0.1,
    TemperatureSensor2: 0.1,
    MainFVesion: 0.1,
    StartFVesion: 0.1,
    LanPort: 1,
  };
  const time1Props = ['DevUpLoadTime', 'DevSumTime', 'StartTime'];
  const relayProps = ['Relay'];
  const checkProps = ['IFSET', 'IfSet_Level', 'GprsGprsEnable', 'If_BasicAxis'];
  const time2Props = ['Installation_Time'];
  const time3Props = ['Last_GprsDate', 'UpgradeTime', 'ChangeRelayTime'];
  const IPProps = ['LanIp'];
  const columns = [{
    dataIndex: 'prop1',
    width: '15%',
    render: text => <p style={{ fontWeight: 'bold' }}>{text}</p>,
  }, {
    dataIndex: 'value1',
    width: '35%',
    render: (text, record) => {
      const value1OnChange = (value, valueToAlter) => {
        dispatch({
          type: 'parmsDetail/onCellChange',
          payload: {
            key: record.key,
            prop: record.prop1,
            index: 'value1',
            value,
            valueToAlter,
          },
        });
      };
      if (!parmsDetail.alter) {
        return text;
      } else if (time1Props.find(value => value === record.prop1)) {
        return (<Time1
          text={text}
          onChange={value1OnChange}
        />);
      } else if (relayProps.find(value => value === record.prop1)) {
        const relay = [];
        for (let i = 1; i <= 8; i += 1) {
          relay.push(parmsDetail.parms[`Relay${i}`]);
        }
        return (<Relay
          text={text}
          relay={relay}
          onChange={value1OnChange}
        />);
      } else if (checkProps.find(value => value === record.prop1)) {
        return (<Check
          text={text}
          check={!!parseInt(parmsDetail.parms[record.prop1], 10)}
          onChange={value1OnChange}
        />);
      } else if (Object.keys(radioValue).find(value => value === record.prop1)) {
        return (<Radio
          value={radioValue[record.prop1]}
          text={text}
          onChange={value1OnChange}
        />);
      } else if (time2Props.find(value => value === record.prop1)) {
        return (<Time2
          text={text}
          onChange={value1OnChange}
        />);
      } else if (Object.keys(step).find(value => value === record.prop1)) {
        return (<InputNumber
          text={text}
          step={step[record.prop1]}
          onChange={value1OnChange}
        />);
      } else if (time3Props.find(value => value === record.prop1)) {
        return (<Time3
          text={text}
          onChange={value1OnChange}
        />);
      } else if (IPProps.find(value => value === record.prop1)) {
        return (<IP
          text={text}
          onChange={value1OnChange}
        />);
      } else {
        return (<InputCell
          value={text}
          onChange={value1OnChange}
        />);
      }
    },
  }, {
    dataIndex: 'prop2',
    width: '15%',
    render: text => <p style={{ fontWeight: 'bold' }}>{text}</p>,
  }, {
    dataIndex: 'value2',
    render: (text, record) => {
      const value2OnChange = (value, valueToAlter) => {
        dispatch({
          type: 'parmsDetail/onCellChange',
          payload: {
            key: record.key,
            prop: record.prop2,
            index: 'value2',
            value,
            valueToAlter,
          },
        });
      };
      if (!parmsDetail.alter) {
        return text;
      } else if (time1Props.find(value => value === record.prop2)) {
        return (<Time1
          text={text}
          onChange={value2OnChange}
        />);
      } else if (relayProps.find(value => value === record.prop2)) {
        const relay = [];
        for (let i = 1; i <= 8; i += 1) {
          relay.push(parmsDetail.parms[`Relay${i}`]);
        }
        return (<Relay
          text={text}
          relay={relay}
          onChange={value2OnChange}
        />);
      } else if (checkProps.find(value => value === record.prop2)) {
        return (<Check
          text={text}
          check={!!parseInt(parmsDetail.parms[record.prop2], 10)}
          onChange={value2OnChange}
        />);
      } else if (Object.keys(radioValue).find(value => value === record.prop2)) {
        return (<Radio
          value={radioValue[record.prop2]}
          text={text}
          onChange={value2OnChange}
        />);
      } else if (time2Props.find(value => value === record.prop2)) {
        return (<Time2
          text={text}
          onChange={value2OnChange}
        />);
      } else if (Object.keys(step).find(value => value === record.prop2)) {
        return (<InputNumber
          text={text}
          step={step[record.prop2]}
          onChange={value2OnChange}
        />);
      } else if (time3Props.find(value => value === record.prop2)) {
        return (<Time3
          text={text}
          onChange={value2OnChange}
        />);
      } else if (IPProps.find(value => value === record.prop2)) {
        return (<IP
          text={text}
          onChange={value2OnChange}
        />);
      } else {
        return (<InputCell
          value={text}
          onChange={value2OnChange}
        />);
      }
    },
  }];
  return (
    <div>
      <Table
        columns={columns}
        showHeader={false}
        dataSource={parmsDetail.data}
        pagination={false}
        size="small"
        bordered
      />
    </div>
  );
};

Detail.propTypes = {
  parmsDetail: PropTypes.object,
  dispatch: PropTypes.func,
};

export default connect(({ parmsDetail, loading }) => ({ parmsDetail, loading: loading.models.parmsDetail }))(Detail)
;
