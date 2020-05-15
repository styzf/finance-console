import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/api/user/users');
}

export async function queryCurrent(): Promise<any> {
  // return request('/api/user/currentUser');
  return;
}

export async function queryNotices(): Promise<any> {
  return;
  // return request('/api/notices');
}
