export interface FinanceBookItem {
  id: string;
  name: string;
  userId: string;
  parentId: string;
  year: number;
  month: number;
  categoryId: string;
  money: number;
  day: number;
  createTime: Date;
  remark: string;
  disabled?: boolean;
}

export interface UpdateData {
  id: string;
  name?: string;
  userId?: string;
  parentId?: string;
  year?: number;
  month?: number;
  categoryId?: string;
  money?: number;
  day?: number;
  createTime?: Date;
  remark?: string;
  disabled?: boolean;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: FinanceBookItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter: string;
  status: string;
  name: string;
  size: number;
  page: number;
  year: number;
  month: number;
  categoryId: string;
  ids: Array<string>;
}

export interface TreeParams {
  parentId: string;
}

export interface TreeData {
  creator: string;
  creatorId: string;
  deleteFlag: boolean;
  id: string;
  langType: string;
  name: string;
  parentId: string;
  updateId: string;
  updater: string;
  userId: string;
  childList: Array<TreeData>;
}
