/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
import pathToRegexp from 'path-to-regexp';
import { Table, message } from 'antd';
import React from 'react';
import fetch from 'dva/fetch';
import socket from '../services/socket.js';
import { apiServer } from '../utils/config';

export default {
    /**
     * namespace用到的地方：
     *  -dispatch；
     *  -全局state中的key；
     */
  namespace: 'home',
  state: {
    statusNo: 0,
    mcTransNo: 0,
    statusNum: 0,
    mcTransNum: 0,
    last: false,
    data: [],
    /**
     * searchValue：
     *  -
     */
    searchValue: [[], '', [], []],
  },
  subscriptions: {
      /**
       * @function 通过socket方式异步获取数据
       * 监听浏览器地址，当跳转到 "/" 时进入该方法
       * history对象会监听地址栏，并将URL转换为location对象，location对象由pathname属性
       * @param dispatch 触发器，用于触发effects中的 "querySuccess" 方法
       */
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/').exec(pathname);
        if (match) {
          /* https://localhost:44382/api/home/homeAll?type=first&statusNo=0&mcTransNo=0&mcTransNum=0&statusNum=0&DevSN=&EventTime=1994-09-09&EventTime=1998-08-08 */
          /* https://localhost:44382/api/home/homeAll?type=first&statusNo=0&mcTransNo=0&mcTransNum=0&statusNum=0&DevSN=&EventTime=&EventTime= */

          const queryString = '?type=first&statusNo=0&mcTransNo=0&mcTransNum=0&statusNum=0&DevSN=&EventTime=&EventTime=';
          const url = `${apiServer}api/home/homeAll${queryString}`;
          fetch(url)
            .then(reponse => reponse.json())
            .then((data) => {
              console.log(data);
              dispatch({ type: 'querySuccess', payload: { data } });
            });
        }
      });
    },
  },

  effects: {
      /**
      *  处理异步操作和业务逻辑，不会直接修改state.可以由action触发。
      *  在effects中可以和服务器交互，可以获取全局state的数据
      *
      *  关于Effects中的API：
      *     put：用于触发action
      *     call：用于调用异步逻辑
      *     select：用于从state中获取数据
      */
    *query({ payload }, { put, select }) {
        /**
         * 需要调用query地方：
         *     -ButtonGroup四个按钮
         */
      const { type, DevSN, EventTime, dataType } = payload;
      let { Index } = payload;
      Index.sort();
      /* 获取state全局中的home */
      const home = yield select(state => state.home);
      if (dataType.length) {
          /* Select Type处有筛选条件时 */
        if (dataType[0] === 'Status') {
          /* 第一级筛选：'Status',如果有第二级筛选，就将第二级筛选值赋给dType；没有则dType='Status'*/
          let dType;
          if (dataType[1]) {
            dType = dataType[1];
            if (dataType[1] === 'Login') {
              Index = [];
            }
          } else {
            dType = 'Status';
          }
          const { statusNo, last } = home;
          if (type === 'left' && statusNo === 0) {
            message.warning('No more data.');
          } else if (type === 'right' && last) {
            message.warning('No more data.');
          } else if (type === 'first') {
            socket.emit('home', { type, statusNo: 0, DevSN, Index, EventTime, dataType: dType });
          } else {
            //last
            socket.emit('home', { type, statusNo, DevSN, Index, EventTime, dataType: dType });
          }
        } else {
            /* 第一级筛选条件：'McTrans' */
          const { mcTransNo, last } = home;
          if (type === 'left' && mcTransNo === 0) {
            message.warning('No more data.');
          } else if (type === 'right' && last) {
            message.warning('No more data.');
          } else if (type === 'first') {
            socket.emit('home', { type, mcTransNo: 0, DevSN, Index, EventTime, dataType });
          } else {
            socket.emit('home', { type, mcTransNo, DevSN, Index, EventTime, dataType });
          }
        }
      } else {
          /* Select Type处为空 */
        const { statusNo, mcTransNo, mcTransNum, statusNum, last } = home;
        if (type === 'left' && (statusNo + mcTransNo) <= 8) {
          message.warning('No more data.');
        } else if (type === 'right' && last) {
          message.warning('No more data.');
        } else if (type === 'first') {
          socket.emit('home', { type, statusNo: 0, mcTransNo: 0, mcTransNum: 0, statusNum: 0, DevSN, EventTime, dataType: 'All' });
        } else {
          socket.emit('home', { type, statusNo, mcTransNo, mcTransNum, statusNum, DevSN, EventTime, dataType: 'All' });
        }
      }
      const data = yield new Promise((resolve) => {
        socket.once('homeData', (data) => {
          resolve(data);
        });
      });
      /* 触发 "querySuccess" action */
      console.log('promise');
      console.log(data);
      yield put({ type: 'querySuccess', payload: { data } });
    },
    /**
     * 调用search方法的地方有：
     *    -点击Reset按钮后，清空搜索条件，然后调用search
     *    -
     */
    * search({ payload }, { put }) {
      const { DevSN, Index, dataType } = payload;
      let { EventTime } = payload;
      /* 触发同步中的 "save" 操作，更新检索条件 */
      yield put({ type: 'save', payload: { searchValue: [dataType, DevSN, Index, EventTime] } });
      Index.sort();

      if (EventTime[0]) {
        EventTime = [EventTime[0].format('YYYY-MM-DD'), EventTime[1].format('YYYY-MM-DD')];
      }
      console.log(EventTime);
      if (dataType.length) {
        if (dataType[0] === 'Status') {
          socket.emit('home', { type: 'first', statusNo: 0, DevSN, Index, EventTime, dataType: dataType[1] ? dataType[1] : 'Status' });
        } else {
          socket.emit('home', { type: 'first', mcTransNo: 0, DevSN, Index, EventTime, dataType });
        }
      } else {
        socket.emit('home', { type: 'first', statusNo: 0, mcTransNo: 0, mcTransNum: 0, statusNum: 0, DevSN, EventTime, dataType: 'All' });
      }
      const data = yield new Promise((resolve) => {
        socket.once('homeData', (data) => {
          resolve(data);
        });
      });
      yield put({ type: 'querySuccess', payload: { data } });
    },
    /* 通过socket方式获取数据成功 */
    *querySuccess({ payload }, { put }) {
      const columns = [{
        dataIndex: 'prop1',
        width: '33%',
      }, {
        dataIndex: 'prop2',
        width: '33%',
      }, {
        dataIndex: 'prop3',
      }];
      const { data } = payload;
      const { homeData, isMcTrans, statusNo, mcTransNo } = data;
      const mcTransNum = isMcTrans.length;
      const statusNum = homeData.length - mcTransNum;
      const dataSource = [];
      const descript = (element) => {
        const description = [];
        const props = [];
        const values = [];
        for (const prop in element) {
          if (prop !== 'alarm' && prop !== 'login' && prop !== 'no') {
            props.push(prop);
            values.push(element[prop]);
          }
        }
        for (let i = 0; i < props.length;) {
          if (i === (props.length - 1)) {
            description.push({
              key: i,
              prop1: <div><span style={{ fontWeight: 'bold' }}>{props[i]}&nbsp;:&nbsp;&nbsp;</span><span>{values[i]}</span></div>,
            });
            break;
          }
          if (i === (props.length - 2)) {
            description.push({
              key: i,
              prop1: <div><span style={{ fontWeight: 'bold' }}>{props[i]}&nbsp;:&nbsp;&nbsp;</span><span>{values[i]}</span></div>,
              prop2: <div><span style={{ fontWeight: 'bold' }}>{props[i++]}&nbsp;:&nbsp;&nbsp;</span><span>{values[i]}</span></div>,
            });
            break;
          }
          description.push({
            key: i,
            prop1: <div><span style={{ fontWeight: 'bold' }}>{props[i]}&nbsp;:&nbsp;&nbsp;</span><span>{values[i]}</span></div>,
            prop2: <div><span style={{ fontWeight: 'bold' }}>{props[i++]}&nbsp;:&nbsp;&nbsp;</span><span>{values[i]}</span></div>,
            prop3: <div><span style={{ fontWeight: 'bold' }}>{props[i++]}&nbsp;:&nbsp;&nbsp;</span><span>{values[i]}</span></div>,
          });
        }
        return description;
      };
      homeData.forEach((element, index) => {
        if (isMcTrans.includes(index)) {
          dataSource.push({
            key: index,
            DevSN: element.DevSN,
            EventTime: element.EventTime,
            Index: element.C_INDEX,
            Type: (`McTrans(${element.EventCode})`),
            description: <Table columns={columns} dataSource={descript(element)} size={'small'} pagination={false} showHeader={false} />,
          });
        } else if (element.alarm) {
          dataSource.push({
            key: index,
            DevSN: element.DevSN,
            EventTime: element.EventTime,
            Index: element.C_INDEX,
            Type: (`Alarm(${element.alarm.EVENT_CODE})`),
            description: <Table columns={columns} dataSource={descript(element)} size={'small'} pagination={false} showHeader={false} />,
          });
        } else if (element.login) {
          dataSource.push({
            key: index,
            DevSN: element.DevSN,
            EventTime: element.EventTime,
            Index: element.C_INDEX,
            Type: 'Login',
            description: <Table columns={columns} dataSource={descript(element)} size={'small'} pagination={false} showHeader={false} />,
          });
        } else {
          dataSource.push({
            key: index,
            DevSN: element.DevSN,
            EventTime: element.EventTime,
            Index: element.C_INDEX,
            Type: 'Schedule',
            description: <Table columns={columns} dataSource={descript(element)} size={'small'} pagination={false} showHeader={false} />,
          });
        }
      });
      let last = false;
      if (homeData.length !== 8) {
        last = true;
      }
      /* 更新state */
      yield put({ type: 'save', payload: { data: dataSource, statusNo, mcTransNo, statusNum, mcTransNum, last } });
    },
    /* 点击Reset按钮后，清空 筛选条件 */
    *clear({ payload }, { put }) {
      yield put({ type: 'save', payload: { searchValue: [[], '', [], []] } });
    },
  },

  reducers: {
      /* 处理同步操作 */
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
