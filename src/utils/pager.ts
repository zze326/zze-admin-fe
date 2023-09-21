export class ReqPagerData implements IReqPagerData {
  constructor(page: number, pageSize: number, search = "", wheres: any = {}) {
    this.page = page;
    this.pageSize = pageSize;
    this.search = search;
    this.wheres = JSON.stringify(wheres);
  }
  page: number;
  pageSize: number;
  search?: string;
  wheres?: string;
}
