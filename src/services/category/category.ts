import request from '@/utils/request';

export async function query(): Promise<any> {
  let list = request('/api/test/category');
  return list;
}
