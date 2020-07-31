export interface PermissionListItem {
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
  Permissionname: string;
  sex: number;
  email:string;
}

export interface UpdateData {
  id: string;
  name: string;
  Permissionname: string;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: PermissionListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter: string;
  status: string;
  name: string;
  size: number;
  page: number;
  Permissionname: string;
  PermissionIds: Array<string>;
  pId: string,
}

export interface MenuTreeData {
  creator: string,
  creatorId: string,
  deleteFlag: boolean,
  id: string,
  menuName: string,
  pId: string,
  code: string,
  updateId: string,
  updater: string,
  url: string,
  childList: Array<MenuTreeData>,
}
