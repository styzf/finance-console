import request from '@/utils/request';
import {CategoryListItem, TableListParams, TreeParams} from './data.d';

export async function queryCategory(params: TableListParams) {
  let data = request('/api/apply/category', {
    params,
  });

  return data;
}

export async function getCategoryTree(params: TreeParams) {
  let data = request('/api/apply/category/tree', {
    params,
  });
  return data;
}

export async function removeCategory(params: TableListParams) {
  return request('/api/apply/category', {
    method: 'DELETE',
    data: params.categoryIds,
  });
}

export async function addCategory(params: TableListParams) {
  return request('/api/apply/category', {
    method: 'POST',
    data: {
      ...params,
      // method: 'post',
    },
  });
}

export async function updateCategory(params: CategoryListItem) {
  return request('/api/apply/category', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
