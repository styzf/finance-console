export interface FinanceTableListItem {
  categoryId: string;
  categoryName?: string;
  childCategoryName?: string;
  disabled?: boolean | false;
  sum?: number;
  1?: number;
  2?: number;
  3?: number;
  4?: number;
  5?: number;
  6?: number;
  7?: number;
  8?: number;
  9?: number;
  10?: number;
  11?: number;
  12?: number;
  13?: number;
  14?: number;
  15?: number;
  16?: number;
  17?: number;
  18?: number;
  19?: number;
  20?: number;
  21?: number;
  22?: number;
  23?: number;
  24?: number;
  25?: number;
  26?: number;
  27?: number;
  28?: number;
  29?: number;
  30?: number;
  31?: number;
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


export interface FinanceListData {
  id:string;
  child:boolean;//是否是子节点
  name:string;
  data:Array<FinanceData>;
}

export interface FinanceData {
  year:number;
  month:number;
  categoryId:number;
  money:number;
  day:number;
}
