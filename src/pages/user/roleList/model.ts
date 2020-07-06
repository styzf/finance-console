import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {addRole, queryRole, removeRole, updateRole} from './service';

import { TableListData} from './data.d';

export interface RoleStateType {
  data: TableListData;
}

export interface RoleStateData {
  data: TableListData;
}

export type RoleEffect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: RoleStateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: {data:TableListData};
  effects: {
    fetch: RoleEffect;
    add: RoleEffect;
    remove: RoleEffect;
    update: RoleEffect;
  };
  reducers: {
    save: Reducer<RoleStateData>;
  };
}

const RoleModel: ModelType = {
  namespace: 'RoleListTableList',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRole, payload);
      yield put({
        type: 'save',
        payload: {
          list:response.data.content,
          pagination: {
            total: Number.parseFloat(response.data.totalElements),
            current: response.data.page,
          },
        },
      });
    },
    *add({ payload, callback }, { call, put }) {
      yield call(addRole, payload);
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      yield call(removeRole, payload);
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      yield call(updateRole, payload);
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

export default RoleModel;
