import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { addRule, queryFinance, removeRule, updateFinance, addFinanceRemark } from './service';

import {FinanceTableListData, FinanceTableListItem, FinanceListData, FinanceData} from './data.d';

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
    addRemark: Effect;
  };
  reducers: {
    save: Reducer<FinanceStateType>;
    updateCallback: Reducer<FinanceStateType>;
    addRemarkCallback: Reducer<FinanceStateType>;
  };
}

const pushData = (list:Array<FinanceTableListItem> ,
                  categoryId:string, categoryName:string, childCategoryName:string,
                  map: Map<string, FinanceData>, disabled:boolean = false) => {
  list.push({
    categoryId:categoryId,
    categoryName: categoryName,
    childCategoryName: childCategoryName,
    disabled:disabled,
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
    sum: map.get('sum'),
  });
}

const sumFinance = (total:Map<string, FinanceData>, data:Map<string, FinanceData>) => {
  for (let i = 0; i < 31; i++) {
    let key = i + 1 + '';
    let value = data.get(key);

    if (value) {
      let dataValue= value.money;
      let totalValue = dataValue;

      // @ts-ignore
      if (total.get(key) && total.get(key).money) {
        // @ts-ignore
        totalValue = total.get(key).money + totalValue;
      }
      total.set(key, {money:totalValue});
    }
  }
}

let differenceKey = 0;

// 计算差值
const difference = (total:Map<string, FinanceData>, list:Array<FinanceTableListItem>,
                    child:boolean = true) => {
  let difference = new Map<string, FinanceData>();

  let previous = 0;
  let sum = 0;
  for (let i = 0; i < 31; i++) {
    let key = i + 1 + '';
    let value = total.get(key);
    if (!value) {
      previous = 0;
      continue;
    }

    difference.set(key, {money:(value.money - previous)});
    sum += value.money - previous;
    previous = value.money;
  }
  difference.set('sum', {money:sum});
  pushData(list, 'difference' + (differenceKey++),
    !child?'差值':'',child?'差值':'',difference, true);
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
      // 还需要获取最后一天的数据
      let dataList = new Array<FinanceListData>()
      let list = new Array<FinanceTableListItem>();
      dataList = response.data;

      // 总值的统计
      let total = new Map<string,FinanceData>();
      // 每个子类进行汇总
      let childTotal = new Map<string,FinanceData>();
      // 是否到了要显示汇总信息的行标识
      let flag = false;
      let key = 0;

      dataList.forEach(data => {
        let map = new Map<string, FinanceData>();
        let categoryName = '';
        let childCategoryName = '';

        data.data.forEach(finance =>
          // @ts-ignore
          map.set(finance.day.toString(),finance));

          if (data.child) {
            childCategoryName = data.name;
            flag = true;
            sumFinance(childTotal, map);
          } else  {
            if (flag) {
              flag = false;
              childCategoryName = '子分类汇总';
              pushData(list, (key++) + 'Total', categoryName, childCategoryName, childTotal, true);
              difference(childTotal,list);
              childTotal = new Map<string,FinanceData>();
            }

            categoryName = data.name;
            childCategoryName = '';
            sumFinance(total, map);
          }

          pushData(list, data.id, categoryName, childCategoryName,map);
      });

      if (flag) {
        flag = false;
        pushData(list, (key++) + 'Total', '',
          '子分类汇总', childTotal, true);
        difference(childTotal,list);
        childTotal = new Map<string,FinanceData>();
      }

      pushData(list, 'total',
        '汇总', '', total, true);
      difference(childTotal,list,false);

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
    *addRemark({ payload, callback }, { call, put }) {
      yield call(addFinanceRemark, payload);
      yield put({
        type: 'addRemarkCallback',
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
          data[payload.day].money = payload.money;
          break;
        }
      }

      return {
        ...state,
        data: state.data,
      };
    },
    addRemarkCallback(state, action) {
      if (!state) {
        return {
          data: {list:[]},
        };
      }

      let payload = action.payload;
      let list = state.data.list;
      for (let data of list) {
        if (data.categoryId === payload.categoryId) {
          data[payload.day].remark = payload.remark;
          break;
        }
      }

      return {
        ...state,
        data: state.data,
      };
    }

  },
};

export default Model;
