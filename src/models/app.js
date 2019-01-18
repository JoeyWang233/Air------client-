export default {

  namespace: 'app',

  state: {
    inputValue: '',
    monitorStates: {
      log: '',
      monitor: '',
      id: {},
      currentId: 0,
      targetDevSN: '',
      trace: false,
      nextId: 0,
      lastId: 0,
    },
  },

  subscriptions: {
        setup({ dispatch, history }) {  // eslint-disable-line
        },
  },

  effects: {
        *fetch({ payload }, { call, put }) {  // eslint-disable-line
          yield put({ type: 'save' });
        },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    inputChange(state, { payload }) {
      const { e } = payload;
      return {
        ...state,
        inputValue: e.target.value,
      };
    },
  },

};

