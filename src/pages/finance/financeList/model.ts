import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { addRule, queryFinance, removeRule, updateFinance } from './service';

import {FinanceTableListData, FinanceTableListItem, FinanceListData} from './data.d';

export interface FinanceStateType {
  data: FinanceTableListData;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: FinanceStateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: FinanceStateType;
  effects: {
    fetch: Effect;
    add: Effect;
    remove: Effect;
    update: Effect;
  };
  reducers: {
    save: Reducer<FinanceStateType>;
    updateCallback: Reducer<FinanceStateType>;
  };
}



const Model: ModelType = {
  namespace: 'financeTableList',

  state: {
    data: {
      list: [],
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFinance, payload);

      let dataList = new Array<FinanceListData>()
      let list = new Array<FinanceTableListItem>();
      dataList = response.data;

      let total = new Map<string,number>();
      let childTotal = new Map<string,number>();

      dataList.forEach(data => {
        let map = new Map<string, string>();
        let categoryName = '';
        let childCategoryName = '';
        if (data.child) {
          childCategoryName = data.name;
        } else {
          categoryName = data.name;
        }

        data.data.forEach(finance => {
          map.set(finance.day.toString(),finance.money);
        });

        list.push({
          categoryId:data.id,
          categoryName: categoryName,
          childCategoryName: childCategoryName,
          1:map.get('1'),
          2:map.get('2'),
          3:map.get('3'),
          4:map.get('4'),
          5:map.get('5'),
          6:map.get('6'),
          7:map.get('7'),
          8:map.get('8'),
          9:map.get('9'),
          10:map.get('10'),
          11:map.get('11'),
          12:map.get('12'),
          13:map.get('13'),
          14:map.get('14'),
          15:map.get('15'),
          16:map.get('16'),
          17:map.get('17'),
          18:map.get('18'),
          19:map.get('19'),
          20:map.get('20'),
          21:map.get('21'),
          22:map.get('22'),
          23:map.get('23'),
          24:map.get('24'),
          25:map.get('25'),
          26:map.get('26'),
          27:map.get('27'),
          28:map.get('28'),
          29:map.get('29'),
          30:map.get('30'),
          31:map.get('31'),
        });
      });

      yield put({
        type: 'save',
        payload: list,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      yield call(updateFinance, payload);
      yield put({
        type: 'updateCallback',
        payload: payload,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: {list:action.payload},
      };
    },
    updateCallback(state, action) {
      if (!state) {
        return {
          data: {list:[]},
        };
      }

      let payload = action.payload;
      let list = state.data.list;
      for (let data of list) {
        if (data.categoryId === payload.categoryId) {
          data[payload.day] = payload.money;
          break;
        }
      }
      console.log({
        ...state,
        data: state.data,
      });
      return {
        ...state,
        data: state.data,
      };
    }

  },
};

export default Model;
