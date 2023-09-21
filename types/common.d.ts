// 通用全局类型声明

interface Resp<T> {
  code: number;
  message: string;
  data: T;
}

interface IReqPagerData {
  page: number;
  pageSize: number;
  search?: string;
  wheres?: any;
}

interface IRespPagerData<T> {
  total: number;
  list: T[];
}
