export interface FinanceTableListItem {
  categoryId: string;
  categoryName?: string;
  childCategoryName?: string;
  disabled?: boolean | false;
  1?: string;
  2?: string;
  3?: string;
  4?: string;
  5?: string;
  6?: string;
  7?: string;
  8?: string;
  9?: string;
  10?: string;
  11?: string;
  12?: string;
  13?: string;
  14?: string;
  15?: string;
  16?: string;
  17?: string;
  18?: string;
  19?: string;
  20?: string;
  21?: string;
  22?: string;
  23?: string;
  24?: string;
  25?: string;
  26?: string;
  27?: string;
  28?: string;
  29?: string;
  30?: string;
  31?: string;
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
  money:string;
  day:number;
}
