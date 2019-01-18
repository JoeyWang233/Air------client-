import pathToRegexp from 'path-to-regexp';
import socket from '../services/socket.js';
export default {
  namespace: 'statusDetail',
  state: {
    DevSN:'',
    data: [],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {       
        const match = pathToRegexp('/latestStatus/:DevSN').exec(pathname)
        if (match) { 
          socket.emit('status', { DevSN: match[1],type:1 });
          socket.once('latestStatus',(data)=>{
            dispatch({type:'querySuccess',payload:{data:data}} )
          });
        }
      })
    },
  },

  effects: {
    // * query ({
    //   payload,
    // }, { call, put }) {
    //     socket.emit('Props',payload);
    //     socket.once('DevProps',(data)=>{
    //       console.log('put');
    //       put({type:'querySuccess',payload:{data:data}});
          
    //     });
    //   const data = yield call(query, payload)
    //     yield put({
    //       type: 'querySuccess',
    //       payload: {
    //         data: data,
    //       },
    //     })
    // },
  },

  reducers: {
    querySuccess (state, { payload }) {
      const { data } = payload
      let DevSN = data.DevSN
      let content = []
      let props = []
      let values = []
      for(let prop in data){
        props.push(prop);
        values.push(data[prop]);
      }
      for(let i=0;i<props.length;){
        content.push({
          key:i,
          prop1:props[i],
          value1:values[i++],
          prop2:props[i],
          value2:values[i++],
        })
      }
      return {
        ...state,
        DevSN,
        data:content,
      }
    },
  },
}