import request from '@/utils/request';
import {RoleListItem, TableListParams} from './data.d';

export async function queryRole(params: TableListParams) {
  let data = request('/api/user/page', {
    params,
  });

  return data;
}

export async function removeRole(params: TableListParams) {
  return request('/api/user/remove', {
    method: 'DELETE',
    data: params.RoleIds,
  });
}

export async function addRole(params: TableListParams) {
  return request('/api/user/save', {
    method: 'POST',
    data: {
      ...params,
      // method: 'post',
    },
  });
}

export async function updateRole(params: RoleListItem) {
  return request('/api/apply/category', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
