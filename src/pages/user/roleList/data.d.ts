export interface RoleListItem {
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
  Rolename: string;
  sex: number;
  email:string;
}

export interface UpdateData {
  id: string;
  name: string;
  Rolename: string;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: RoleListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter: string;
  status: string;
  name: string;
  size: number;
  page: number;
  Rolename: string;
  RoleIds: Array<string>;
}
