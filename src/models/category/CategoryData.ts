import { query } from '@/services/category/category';
import {object, string} from "prop-types";

export default {
  namespace: 'category',
  state: {
    authorityMap:object,
    data: object,
    msg: string,
    providerSpans: string,
    success: Boolean,
    traceId: string,
    webIpAddress: string
  },
  reducers : {
    initDataList(state:object, result:any) {
      console.log(result.data)
      return result.data;
    }
  },
  effects : {
    *initData(params:any, sagaEffects:any) {
      const {call, put} = sagaEffects;
      let data = yield call(query, params);
      yield put({
        type: "initDataList" ,
        data : data
      })
    }
  }
}
