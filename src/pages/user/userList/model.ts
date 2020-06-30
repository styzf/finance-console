import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {addUser, queryUser, removeUser, updateUser} from './service';

import { TableListData} from './data.d';

export interface UserStateType {
  data: TableListData;
}

export interface UserStateData {
  data: TableListData;
}

export type UserEffect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: UserStateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: {data:TableListData};
  effects: {
    fetch: UserEffect;
    add: UserEffect;
    remove: UserEffect;
    update: UserEffect;
  };
  reducers: {
    save: Reducer<UserStateData>;
  };
}

const UserModel: ModelType = {
  namespace: 'userListTableList',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUser, payload);
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
      yield call(addUser, payload);
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      yield call(removeUser, payload);
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      yield call(updateUser, payload);
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

export default UserModel;
