export interface FinanceTableListItem {
  categoryId: string;
  categoryName?: string;
  childCategoryName?: string;
  disabled?: boolean | false;
  sum?: FinanceData;
  1?: FinanceData;
  2?: FinanceData;
  3?: FinanceData;
  4?: FinanceData;
  5?: FinanceData;
  6?: FinanceData;
  7?: FinanceData;
  8?: FinanceData;
  9?: FinanceData;
  10?: FinanceData;
  11?: FinanceData;
  12?: FinanceData;
  13?: FinanceData;
  14?: FinanceData;
  15?: FinanceData;
  16?: FinanceData;
  17?: FinanceData;
  18?: FinanceData;
  19?: FinanceData;
  20?: FinanceData;
  21?: FinanceData;
  22?: FinanceData;
  23?: FinanceData;
  24?: FinanceData;
  25?: FinanceData;
  26?: FinanceData;
  27?: FinanceData;
  28?: FinanceData;
  29?: FinanceData;
  30?: FinanceData;
  31?: FinanceData;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface FinanceTableListData {
  list: FinanceTableListItem[];
}

export interface TableListParams {
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  currentPage: number;
  year:number;
  month:number;
}

export interface UpdateFinanceParams {
  year:number;
  month:number;
  day:number;
  categoryId:string;
  money: string;
}

export interface UpdateFinanceRemarkParams {
  year?:number;
  month?:number;
  categoryId?:string;
  day?:number;
  remark?: string;
}

export interface FinanceListData {
  id:string;
  child:boolean;//是否是子节点
  name:string;
  data:Array<FinanceData>;
}

export interface FinanceData {
  year?:number;
  month?:number;
  categoryId?:number;
  money:number;
  day?:number;
  remark?: string;
}
