export interface UserListItem {
  id: string;
  disabled?: boolean;
  href: string;
  avatar: string;
  name: string;
  title: string;
  owner: string;
  desc: string;
  callNo: number;
  status: number;
  updatedAt: Date;
  createTime: Date;
  progress: number;
  username: string;
  sex: number;
  email:string;
}

export interface UpdateData {
  id: string;
  name: string;
  username: string;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: UserListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter: string;
  status: string;
  name: string;
  size: number;
  page: number;
  username: string;
  userIds: Array<string>;
}
