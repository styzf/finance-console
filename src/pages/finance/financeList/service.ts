import request from '@/utils/request';
import { TableListParams, UpdateFinanceRemarkParams } from './data.d';

export async function queryFinance(params: TableListParams) {
  return request('/api/apply/finance', {
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
  return request('/api/apply/finance', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addFinanceRemark(params: UpdateFinanceRemarkParams) {
  return request('/api/apply/finance/addRemark', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
