import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
// import { routerRedux } from 'dva/router';
import { fakeAccountLogin, getFakeCaptcha } from './service';
import { getPageQuery, setAuthority } from './utils/utils';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    getCaptcha: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userLogin',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);

      // 存储权限信息
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.success) {
        const urlParams = new URL(window.location.href);
        console.log(urlParams);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          console.log(redirectUrlParams);
          if (redirectUrlParams.origin === urlParams.origin) {
            // redirect = redirect.substr(urlParams.origin.length);
            // if (redirect.match(/^\/.*#/)) {
            //   redirect = redirect.substr(redirect.indexOf('#') + 1);
            // }
            window.location.href = redirect;
          } else {
            // 先不开放对外链接跳转
            // window.location.href = redirect;
            return;
          }
        } else {
          console.log(urlParams.origin);
          window.location.href = urlParams.origin;
        }
        // window.alert(redirect);
        // yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.authList);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;
