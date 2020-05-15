import request from '@/utils/request';
import { FinanceBookItem, TableListParams } from './data.d';

export async function queryFinance(params: TableListParams) {
  let data = request('/api/apply/finance/book', {
    params,
  });

  return data;
}

export async function removeFinance(params: TableListParams) {
  return request('/api/apply/finance', {
    method: 'DELETE',
    data: params.ids,
  });
}

export async function addFinance(params: TableListParams) {
  return request('/api/apply/finance', {
    method: 'POST',
    data: {
      ...params,
      // method: 'post',
    },
  });
}

export async function updateFinance(params: FinanceBookItem) {
  return request('/api/apply/finance', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
