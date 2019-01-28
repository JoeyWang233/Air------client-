/* eslint-disable no-multiple-empty-lines */
/* eslint-disable guard-for-in */
/* eslint-disable no-console */
/* eslint-disable one-var */
/* eslint-disable eqeqeq */
/* eslint-disable prefer-const */
/* eslint-disable no-tabs */
/* eslint-disable radix */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
import { Icon, message } from 'antd';
import fetch from 'dva/fetch';
import React from 'react';
import { apiServer } from '../utils/config';

const removeProps = ['DevSN', 'DevID', 'DevName', 'SiteNo', 'MachineNo', 'SimN',
  'AuthorizeNumber2', 'AuthorizeNumber3', 'CurrentAuthorizeNumber',	'UserReserve'];
const radioValue = {
  OperatorSetting: ['Auto', 'Manual', 'Default'],
  NetModeSetting: ['Auto', 'GPRS', 'LAN'],
  GprsConnectMode: ['IP', 'Domain'],
  ParReset: ['N/A', 'Reset Status', 'Reset Status and Parms'],
};
const time1Props = ['DevUpLoadTime', 'DevSumTime', 'StartTime'];
const checkProps = ['IFSET', 'IfSet_Level', 'GprsGprsEnable', 'If_BasicAxis'];
const input = value => value;
const time1 = value => (`${value.slice(0, -2)}:${value.slice(-2)}`);
const relay = (value) => {
  const relay = [];
  value.forEach((relayValue, index) => {
    relay.push(<span key={index}>{parseInt(relayValue) ? <Icon type="check-square" /> : <Icon type="close-square-o" />}&nbsp;{index + 1}&nbsp;&nbsp;</span>);
  });
  return relay;
};
const check = value => (parseInt(value) ? <Icon type="check-square" /> : <Icon type="close-square-o" />);
const radio = value => value;
export default {
  namespace: 'parmsDetail',
  state: {
    alter: false,
    DevSN: '',
    parms: {},
    data: [],
    dataAltered: {},
  },

  effects: {
    *query({ payload }, { put }) {
      /* 点击parms tag下的action,获取 parms tag 要进行展示的数据 */
      const { DevSN } = payload;

      let queryString;
      let url;
      let data;

      queryString = `?DevSN=${DevSN}`;
      url = `${apiServer}api/Props/getProps${queryString}`;
      console.log(`${url} +++  开始fetch啦`);
      yield fetch(url)
        .then(response => response.json())
        .then((data1) => { data = data1; console.log(data); });
      console.log('fetch结束了');

      /* socket.emit('Props', { DevSN, type: 1 });
      const data = yield call(() => {
        return new Promise((resolve) => {
          socket.once('DevProps', (data) => {
            console.log('once(DevProps)');
            console.log(data);
            resolve(data);
          });
        });
      }); */
      yield put({ type: 'querySuccess', payload: { data, DevSN } });
    },
    *querySuccess({ payload }, { put }) {
      const { data, DevSN } = payload;
      let content = [];
      let props = [];
      let values = [];
      for (let prop in data) {
        props.push(prop);
        values.push(data[prop]);
      }
      let text = new Array(props.length);
      let relayValue = [];
      for (let i = 0; i < props.length; i++) {
        if (!removeProps.find(prop => prop == props[i])) {
          if (!(/Relay\d/.test(props[i]))) {
            if (time1Props.find(prop => prop == props[i])) {
              text[i] = time1(values[i]);
            } else if (checkProps.find(prop => prop == props[i])) {
              text[i] = check(values[i]);
            } else if (Object.keys(radioValue).find(prop => prop == props[i])) {
              text[i] = radio(radioValue[props[i]][parseInt(values[i])]);
            } else {
              text[i] = input(values[i]);
            }
          } else {
            relayValue.push(parseInt(values[i]));
            if (relayValue.length == 8) {
              text[i] = relay(relayValue);
            }
          }
        }
      }
      let initIndex = 0;
      while (text[initIndex] == null && initIndex < text.length) { initIndex++; }
      for (let i = initIndex; i < text.length;) {
        let prop1,
          value1,
          prop2,
          value2;
        value1 = text[i];
        if (!(/Relay\d/.test(props[i]))) {
          prop1 = props[i];
        } else {
          prop1 = 'Relay';
        }
        i++;
        while (text[i] == null && i < text.length) { i++; }
        value2 = text[i];
        if (!(/Relay\d/.test(props[i]))) {
          prop2 = props[i];
        } else {
          prop2 = 'Relay';
        }
        content.push({
          key: i,
          prop1,
          value1,
          prop2,
          value2,
        });
        i++;
        while (text[i] == null && i < text.length) { i++; }
      }
      yield put({ type: 'save', payload: { parms: data, data: content, DevSN } });
    },
    *alter({ payload }, { select, put }) {
      /* 在parms tag下，点击Alter调用 */
      const state = yield select(state => state.parmsDetail);
      let setProps = '';
      let url;
      let queryString;
      let result;

      if (state.alter) {
        if (Object.keys(state.dataAltered).length === 0) {
          yield put({ type: 'save', payload: { alter: false } });
        } else {
          for (let prop in state.dataAltered) {
            setProps += `${prop} = '${state.dataAltered[prop]}',`;
          }

          queryString = `?alteredProps=${setProps.slice(0, -1)}&DevSN=${state.DevSN}`;
          url = `${apiServer}api/Props/alterProps${queryString}`;
          console.log(url);

          yield fetch(url)
            .then(response => response.json())
            .then((data) => { result = data; console.log(`result:${result}`); });

          // yield socket.emit('Props', { type: 2, props: state.dataAltered, DevSN: state.DevSN });

          /* const result = yield call(() => {
            return new Promise((resolve) => {
              socket.once('alterProps', (data) => {
                console.log('once(alterProps)');
                console.log(data);
                resolve(data);
              });
            });
          }); */

          if (result != -1) {
            message.success('Succeed to alter parms.');
            yield put({ type: 'save', payload: { alter: false, dataAltered: {} } });
          } else {
            message.error('Fail to alter parms.');
          }
        }
      } else {
        yield put({ type: 'save', payload: { alter: true } });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    onCellChange(state, { payload }) {
      const { key, prop, index, value, valueToAlter } = payload;
      const { parms, dataAltered } = state;
      if (prop === 'Relay') {
        for (let i = 1; i <= 8; i++) {
          dataAltered[`Relay${i}`] = valueToAlter[i - 1];
          parms[`Relay${i}`] = valueToAlter[i - 1];
        }
      } else {
        dataAltered[prop] = valueToAlter;
        parms[prop] = valueToAlter;
      }
      const data = [...state.data];
      const target = data.find(item => item.key === key);
      if (target) {
        target[index] = value;
        return {
          ...state,
          data,
          parms,
          dataAltered,
        };
      }
    },
  },
};
