import request from '@/utils/request';
import {CategoryListItem, TableListParams, TreeParams} from './data.d';

export async function queryCategory(params: TableListParams) {
  let data = request('/api/category', {
    params,
  });

  return data;
}

export async function getCategoryTree(params: TreeParams) {
  let data = request('/api/category/tree', {
    params,
  });
  return data;
}

export async function removeCategory(params: TableListParams) {
  return request('/api/category', {
    method: 'DELETE',
    data: params.categoryIds,
  });
}

export async function addCategory(params: TableListParams) {
  return request('/api/category', {
    method: 'POST',
    data: {
      ...params,
      // method: 'post',
    },
  });
}

export async function updateCategory(params: CategoryListItem) {
  return request('/api/category', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
