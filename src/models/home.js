/* eslint-disable no-trailing-spaces */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
import pathToRegexp from 'path-to-regexp';
import { Table, message } from 'antd';
import React from 'react';
import fetch from 'dva/fetch';
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

          const queryString = '?type=first&statusNo=0&mcTransNo=0&mcTransNum=0&statusNum=0&DevSN=&EventTime=undefined&EventTime=undefined';
          const url = `${apiServer}api/home/All${queryString}`;
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
         *     -ButtonGroup 四个按钮
         */
      const { type, DevSN, EventTime, dataType } = payload;
      let { Index } = payload;
      let queryString;
      let url;
      let data;
      Index.sort();
      /* 获取state全局中的home */
      const home = yield select(state => state.home);
      /* 如果有筛选条件 */
      if (dataType.length) {
          /* Select Type处有筛选条件时 */
        console.log('筛选处有值');
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
            console.log('right and last');
            message.warning('No more data.');
          } else if (type === 'first') {
            queryString = `?type=${type}&statusNo=0&DevSN=${DevSN}&Index=${Index[0]}&Index=${Index[1]}&EventTime=${EventTime[0]}&EventTime=${EventTime[1]}&dataType=${dType}`;
            url = `${apiServer}api/home/${dataType[1] ? 'AlarmOrLogin' : 'Status'}${queryString}`;

            console.log('要调用fetch啦');
            yield fetch(url)
              .then(response => response.json())
              .then((data1) => { data = data1; console.log('1'); });
            console.log('fetch调用完啦');

            console.log(data);
            yield put({ type: 'querySuccess', payload: { data } });
            // socket.emit('home', { type, statusNo: 0, DevSN, Index, EventTime, dataType: dType });
          } else {
            queryString = `?type=${type}&statusNo=${statusNo}&DevSN=${DevSN}&Index=${Index[0]}&Index=${Index[1]}&EventTime=${EventTime[0]}&EventTime=${EventTime[1]}&dataType=${dType}`;
            url = `${apiServer}api/home/${dataType[1] ? 'AlarmOrLogin' : 'Status'}${queryString}`;

            console.log('要调用fetch啦');
            yield fetch(url)
              .then(response => response.json())
              .then((data1) => { data = data1; console.log('1'); });
            console.log('fetch调用完啦');

            console.log(data);
            yield put({ type: 'querySuccess', payload: { data } });
            // socket.emit('home', { type, statusNo, DevSN, Index, EventTime, dataType: dType });
          }
        } else {
            /* 第一级筛选条件：'McTrans' */
          const { mcTransNo, last } = home;
          if (type === 'left' && mcTransNo === 0) {
            message.warning('No more data.');
          } else if (type === 'right' && last) {
            message.warning('No more data.');
          } else if (type === 'first') {
            queryString = `?type=${type}&mcTransNo=0&DevSN=${DevSN}&Index=${Index[0]}&Index=${Index[1]}&EventTime=${EventTime[0]}&EventTime=${EventTime[1]}&dataType=${dataType[0]}&dataType=${dataType[1]}`;
            url = `${apiServer}api/home/McTrans${queryString}`;
            
            console.log('要调用fetch啦');
            yield fetch(url)
              .then(response => response.json())
              .then((data1) => { data = data1; console.log('1'); });
            console.log('fetch调用完啦');

            console.log(data);
            yield put({ type: 'querySuccess', payload: { data } });
            
            // socket.emit('home', { type, mcTransNo: 0, DevSN, Index, EventTime, dataType });
          } else {
            queryString = `?type=${type}&mcTransNo=${mcTransNo}&DevSN=${DevSN}&Index=${Index[0]}&Index=${Index[1]}&EventTime=${EventTime[0]}&EventTime=${EventTime[1]}&dataType=${dataType[0]}&dataType=${dataType[1]}`;
            url = `${apiServer}api/home/McTrans${queryString}`;
            
            console.log('要调用fetch啦');
            yield fetch(url)
              .then(response => response.json())
              .then((data1) => { data = data1; console.log('1'); });
            console.log('fetch调用完啦');

            console.log(data);
            yield put({ type: 'querySuccess', payload: { data } });

            // socket.emit('home', { type, mcTransNo, DevSN, Index, EventTime, dataType });
          }
        }
      } else {
          /* Select Type处为空 */
        console.log('筛选处没有值');
        const { statusNo, mcTransNo, mcTransNum, statusNum, last } = home;
        if (type === 'left' && (statusNo + mcTransNo) <= 8) {
          message.warning('No more data.');
        } else if (type === 'right' && last) {
          message.warning('No more data.');
        } else if (type === 'first') {
          queryString = `?type=${type}&statusNo=0&mcTransNo=0&mcTransNum=0&statusNum=0&DevSN=${DevSN}&EventTime=${EventTime[0]}&EventTime=${EventTime[1]}`;
          url = `${apiServer}api/home/All${queryString}`;

          console.log('要调用fetch啦');
          yield fetch(url)
            .then(response => response.json())
            .then((data1) => { data = data1; console.log('1'); });
          console.log('fetch调用完啦');

          console.log(data);
          yield put({ type: 'querySuccess', payload: { data } });

          // socket.emit('home', { type, statusNo: 0, mcTransNo: 0, mcTransNum: 0, statusNum: 0, DevSN, EventTime, dataType: 'All' });
        } else {
          queryString = `?type=${type}&statusNo=${statusNo}&mcTransNo=${mcTransNo}&mcTransNum=${mcTransNum}&statusNum=${statusNum}&DevSN=${DevSN}&EventTime=${EventTime[0]}&EventTime=${EventTime[1]}`;
          url = `${apiServer}api/home/All${queryString}`;

          console.log('要调用fetch啦');
          yield fetch(url)
            .then(response => response.json())
            .then((data1) => { data = data1; console.log('1'); });
          console.log('fetch调用完啦');

          console.log(data);
          yield put({ type: 'querySuccess', payload: { data } });
          
          // socket.emit('home', { type, statusNo, mcTransNo, mcTransNum, statusNum, DevSN, EventTime, dataType: 'All' });
        }
      }
      /* const data = yield new Promise((resolve) => {
        socket.once('homeData', (data) => {
          resolve(data);
        });
      }); */
    },
    /**
     * 调用search方法的地方有：
     *    -点击Reset按钮后，清空搜索条件，然后调用search
     *    -
     */
    * search({ payload }, { put }) {
      const { DevSN, Index, dataType } = payload;
      let { EventTime } = payload;
      let url;
      let queryString;
      let data;
      /* 触发同步中的 "save" 操作，更新检索条件 */
      yield put({ type: 'save', payload: { searchValue: [dataType, DevSN, Index, EventTime] } });
      Index.sort();
      console.log(`2 + ${DevSN}`);

      if (EventTime[0]) {
        EventTime = [EventTime[0].format('YYYY-MM-DD'), EventTime[1].format('YYYY-MM-DD')];
      }
      console.log(`EventTime ${EventTime}`);
      if (dataType.length) {
        if (dataType[0] === 'Status') {
          // 如果有二级筛选，dataType就为二级筛选，否则Status
          queryString = `?type=first&statusNo=0&DevSN=${DevSN}&Index=${Index[0]}&Index=${Index[1]}&EventTime=${EventTime[0]}&EventTime=${EventTime[1]}&dataType=${dataType[1] ? dataType[1] : 'Status'}`;
          url = `${apiServer}api/home/${dataType[1] ? 'AlarmOrLogin' : 'Status'}${queryString}`;
          // socket.emit('home', { type: 'first', statusNo: 0, DevSN, Index, EventTime, dataType: dataType[1] ? dataType[1] : 'Status' });
        } else {
          // 选择mcTrans
          queryString = `?type=first&mcTransNo=0&DevSN=${DevSN}&Index=${Index[0]}&Index=${Index[1]}&EventTime=${EventTime[0]}&EventTime=${EventTime[1]}&dataType=${dataType[0]}&dataType=${dataType[1]}`;
          url = `${apiServer}api/home/McTrans${queryString}`;
          // socket.emit('home', { type: 'first', mcTransNo: 0, DevSN, Index, EventTime, dataType });
        }
      } else {
        // homeAll
        queryString = `?type=first&statusNo=0&mcTransNo=0&mcTransNum=0&statusNum=0&DevSN=${DevSN}&EventTime=${EventTime[0]}&EventTime=${EventTime[1]}`;
        url = `${apiServer}api/home/All${queryString}`;
      }
      /* const data = yield new Promise((resolve) => {
        socket.once('homeData', (data) => {
          resolve(data);
        });
      }); */
      console.log('要调用fetch啦');
      yield fetch(url)
        .then(response => response.json())
        .then((data1) => { data = data1; });
      console.log('fetch调用完啦');
      console.log(data);
      yield put({ type: 'querySuccess', payload: { data } });
    },
    /* 通过socket方式获取数据成功 */
    *querySuccess({ payload }, { put }) {
      console.log('querySuccess第一行');
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
        console.log('homeData.length !== 8 ');
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
