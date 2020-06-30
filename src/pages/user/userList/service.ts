import request from '@/utils/request';
import {UserListItem, TableListParams} from './data.d';

export async function queryUser(params: TableListParams) {
  let data = request('/api/user/list', {
    params,
  });

  return data;
}

export async function removeUser(params: TableListParams) {
  return request('/api/user/remove', {
    method: 'DELETE',
    data: params.userIds,
  });
}

export async function addUser(params: TableListParams) {
  return request('/api/user/save', {
    method: 'POST',
    data: {
      ...params,
      // method: 'post',
    },
  });
}

export async function updateUser(params: UserListItem) {
  return request('/api/apply/category', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
