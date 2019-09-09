import request from '@/utils/request';
import { TableListParams } from './data.d';

export async function queryFinance(params: TableListParams) {
  return request('/api/finance', {
    params,
  });
}

export async function removeRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateFinance(params: TableListParams) {
  return request('/api/finance', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
