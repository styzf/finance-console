import request from '@/utils/request';
import {PermissionListItem, TableListParams} from './data.d';

export async function queryPermission(params: TableListParams) {
  let data = request('/api/user/menu/page', {
    params,
  });

  return data;
}

export async function queryPermissionTree(pId: string) {
  let data = request('/api/user/menu/tree', {
    method: 'GET',
    data: {pid:pId},
  });

  return data;
}

export async function removePermission(params: TableListParams) {
  return request('/api/user/menu/remove', {
    method: 'DELETE',
    data: params.PermissionIds,
  });
}

export async function addPermission(params: TableListParams) {
  return request('/api/user/menu', {
    method: 'POST',
    data: {
      ...params,
      // method: 'post',
    },
  });
}

export async function updatePermission(params: PermissionListItem) {
  return request('/api/user/menu', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
