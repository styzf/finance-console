import request from '@/utils/request';
import {RoleListItem, TableListParams} from './data.d';

export async function queryRole(params: TableListParams) {
  let data = request('/api/user/role/page', {
    params,
  });

  return data;
}

export async function removeRole(params: TableListParams) {
  return request('/api/user/role/remove', {
    method: 'DELETE',
    data: params.RoleIds,
  });
}

export async function addRole(params: TableListParams) {
  return request('/api/user/role', {
    method: 'POST',
    data: {
      ...params,
      // method: 'post',
    },
  });
}

export async function updateRole(params: RoleListItem) {
  return request('/api/user/role', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
