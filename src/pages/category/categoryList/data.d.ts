export interface CategoryListItem {
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
  key: string;
  parentId: string;
  categoryKey: string;
}

export interface CategoryTreeVo {
  title:string;
  key:string;
  children:CategoryTreeVo[];
  parentKey:string;
}

export interface UpdateData {
  id: string;
  name: string;
  parentId: string;
  categoryKey: string;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: CategoryListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter: string;
  status: string;
  name: string;
  size: number;
  page: number;
  parentId: string;
  categoryIds: Array<string>;
}

export interface TreeParams {
  parentId: string;
}

export interface TreeData {
  creator: string,
  creatorId: string,
  deleteFlag: boolean,
  id: string,
  langType: string,
  name: string,
  parentId: string,
  updateId: string,
  updater: string,
  userId: string,
  childList: Array<TreeData>,
}

