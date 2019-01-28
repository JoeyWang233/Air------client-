/* eslint-disable prefer-const */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable no-plusplus */
import pathToRegexp from 'path-to-regexp';
import fetch from 'dva/fetch';
import { apiServer } from '../utils/config';

export default {
  namespace: 'detail',
  state: {
    checked: [],
    DevSN: '',
    constParms: {},
    data: [],
    statusNo: 1,
    mcTransNo: 1,
    mcTransTotalNo: 1,
    alarmNo: 1,
    alarmTotalNo: 1,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/devices/:DevSN').exec(pathname);
        let queryString;
        let url;
        if (match) {
          /**
           * match[0]: devices
           * match[1]: DevSN
           */

          /* https://localhost:44382/api/tableData/getDetail?DevSN=862952025794560 */

          queryString = `?DevSN=${match[1]}`;
          url = `${apiServer}api/tableData/getDetail${queryString}`;

          fetch(url)
          .then(response => response.json())
          .then((data) => {
            /**
             * data:请求数据库返回的数据。格式需要进一步确定：
             * 'status'：将数据处理，将处理结果content放入state
             * 'constParm'：同步操作，将data数据放入detail中的constParm字段中
             */
            console.log("from fetch emit('tableData') once('deviceData')");
            console.log(data);
            dispatch({ type: 'status', payload: { data: data[0], DevSN: match[1], statusNo: 1 } });
            dispatch({ type: 'constParm', payload: { data: data[1] } });
          });


          // socket.emit('tableData', { DevSN: match[1], type: 1 });
          // socket.once('deviceData', (data) => {
          //   /**
          //    * data:请求数据库返回的数据。格式需要进一步确定：
          //    * 'status'：将数据处理，将处理结果content放入state
          //    * 'constParm'：同步操作，将data数据放入detail中的constParm字段中
          //    */
          //   console.log("emit('tableData') once('deviceData')");
          //   console.log(data);
          //   dispatch({ type: 'status', payload: { data: data[0], DevSN: match[1], statusNo: 1 } });
          //   dispatch({ type: 'constParm', payload: { data: data[1] } });
          // });
        }
      });
    },
  },

  effects: {
    *switchStatus({ payload }, { put }) {
      /* 在Detail页面，Status tag，点击四个切换按钮对应的action */
      let { No } = payload;
      const { DevSN, type } = payload;
      switch (type) {
        case 'first':
          No = 1;
          break;
        case 'left':
          No = (No === 1 ? No : (No - 1));
          break;
        case 'right':
          No += 1;
          break;
        case 'last':
          No = 'last';
          break;
        default:
      }
      yield put({ type: 'queryStatus', payload: { DevSN, No } });
    },



    /* 三个type=2 */
    *queryStatus({ payload }, { put }) {
      /**
       * 点击Status标签的action
       * yield call：用以调用异步逻辑
       * 到时候改写的主要任务：用ajax异步获取数据，采用promise对象
       */
      const { DevSN, No } = payload;
      let queryString;
      let url;
      let data;

      /* socket.emit('tableData', { DevSN, No, table: 1, type: 2 });
      const data = yield call(() => {
        return new Promise((resolve) => {
          socket.once('deviceData', (data) => {
            console.log('emit tableData  type 2');
            console.log(data);
            resolve(data);
          });
        });
      }); */

      queryString = `?DevSN=${DevSN}&No=${No}&table=1`;
      url = `${apiServer}api/tableData/getData${queryString}`;
      yield fetch(url)
        .then(response => response.json())
        .then((data1) => { data = data1; });

      yield put({ type: 'status', payload: { data: data[0][0], DevSN, statusNo: (No === 'last' ? data[1] : No) } });
    },
    *queryMcTrans({ payload }, { put }) {
      /**
       * 点击McTrans标签的action
       */
      const { DevSN, page, pageSize } = payload;
      let queryString;
      let url;
      let data;


      /* socket.emit('tableData', { DevSN, table: 2, type: 2, No: page, pageSize });
      const data = yield call(() => {
        return new Promise((resolve) => {
          socket.once('deviceData', (data) => {
            resolve(data);
          });
        });
      }); */

      queryString = `?DevSN=${DevSN}&table=2&No=${page}&pageSize=${pageSize}`;
      url = `${apiServer}api/tableData/getData${queryString}`;
      yield fetch(url)
        .then(response => response.json())
        .then((data1) => { data = data1; });

      yield put({ type: 'McTrans', payload: { data: data[0], mcTransNo: page, mcTransTotalNo: data[1] } });
    },
    *queryAlarm({ payload }, { put }) {
      /**
       * 点击Alarm标签的action
       */
      const { DevSN, page, pageSize } = payload;
      let queryString;
      let url;
      let data;


      /* socket.emit('tableData', { DevSN, table: 3, type: 2, No: page, pageSize });
      const data = yield call(() => {
        return new Promise((resolve) => {
          socket.once('deviceData', (data) => {
            resolve(data);
          });
        });
      }); */

      queryString = `?DevSN=${DevSN}&table=3&No=${page}&pageSize=${pageSize}`;
      url = `${apiServer}api/tableData/getData${queryString}`;
      yield fetch(url)
        .then(response => response.json())
        .then((data1) => { data = data1; });

      yield put({ type: 'Alarm', payload: { data: data[0], alarmNo: page, alarmTotalNo: data[1] } });
    },


    *queryParms({ payload }, { put }) {
      /* 点击parms tag下的action */
      const { checked } = payload;
      if (checked) {
        console.log('in *queryParms');
        yield put({ type: 'save', payload: { checked: [false, false, true, false] } });
      }
    },
    *status({ payload }, { put }) {
      /**
       * 被调用的地方有：
       *    --queryStatus
       * @function 将通过socket方式获得的数据封装，存入状态中
       */
      const { data, DevSN, statusNo } = payload;
      const content = [];
      /* props、values两个数组分别保存了key-value，两者之间没有key-value关系，这种方式不好 */
      const props = [];
      const values = [];
      for (const prop in data) {
        if (prop !== 'DevSN' && prop !== 'UserReserve') {
          props.push(prop);
          values.push(data[prop]);
        }
      }
      for (let i = 0; i < props.length;) {
        /** content数组用来保存status界面的显示内容，一个元素是一行.
         *  content示例：
         * [{
         *  key:1,
         *  prop1:C_INDEX
         *  value1:00002366
         *  prop2:EventTime
         *  value2:2016-11-22 14:35:00
         * },
         * {
         *  key:2,
         *  prop1:Longitude
         *  value1:
         *  prop2:Latitude
         *  value2:
         * },
         * ...
         * ]
         */
        content.push({
          key: i,
          prop1: props[i],
          value1: values[i++],
          prop2: props[i],
          value2: values[i++],
        });
      }
      yield put({ type: 'save', payload: { data: content, DevSN, checked: [true, false, false, false], statusNo } });
    },
    *McTrans({ payload }, { put }) {
      const { data, mcTransNo, mcTransTotalNo } = payload;
      const content = [];
      if (data) {
        for (let i = 0; i < data.length; i++) {
          const props = {};
          for (const prop in data[i]) {
            if (prop !== 'DevSN' && prop !== 'SiteNo' && prop !== 'McNo' && prop !== 'CoinValue' && prop !== 'NoOfCoins') {
              props[prop] = data[i][prop];
            }
          }
          props.key = props.C_INDEX;
          content.push(props);
        }
      }
      yield put({ type: 'save', payload: { data: content, mcTransNo, mcTransTotalNo, checked: [false, true, false, false] } });
    },
    *Alarm({ payload }, { put }) {
      const { data, alarmNo, alarmTotalNo } = payload;
      const content = [];
      if (data) {
        for (let i = 0; i < data.length; i++) {
          const props = {};
          for (const prop in data[i]) {
            if (prop !== 'DevSN') {
              props[prop] = data[i][prop];
            }
          }
          props.key = props.C_INDEX;
          content.push(props);
        }
      }
      yield put({ type: 'save', payload: { data: content, alarmNo, alarmTotalNo, checked: [false, false, false, true] } });
    },

  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    constParm(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        constParms: data,
      };
    },
  },
};

