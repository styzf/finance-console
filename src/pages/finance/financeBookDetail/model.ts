import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { addFinance, queryFinance, removeFinance, updateFinance } from './service';

import { TableListData } from './data.d';

export interface FinanceStateType {
  data: TableListData;
}

export interface FinanceStateData {
  data: TableListData;
}

export type FinanceEffect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: FinanceStateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: { data: TableListData };
  effects: {
    fetch: FinanceEffect;
    add: FinanceEffect;
    remove: FinanceEffect;
    update: FinanceEffect;
  };
  reducers: {
    save: Reducer<FinanceStateData>;
  };
}

const FinanceModel: ModelType = {
  namespace: 'financeBook',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFinance, payload);
      console.log('response');
      console.log(response);
      yield put({
        type: 'save',
        payload: {
          list: response.data.content,
          pagination: {
            total: Number.parseFloat(response.data.totalElements),
            current: response.data.page,
          },
        },
      });
    },
    *add({ payload, callback }, { call, put }) {
      yield call(addFinance, payload);
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      yield call(removeFinance, payload);
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      yield call(updateFinance, payload);
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};

export default FinanceModel;
