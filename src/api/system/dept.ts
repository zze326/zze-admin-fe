import { http } from "@/utils/http";

export type Model = {
  id: number;
  name: string;
  rank: number;
  parentId: number;
  updatedAt: string;
};

/** 新增部门 */
export const addApi = (data: Partial<Model>) =>
  http.request<Resp<null>>("post", "/dept", { data });

/** 获取部门列表 */
export const getLstApi = (data: { search: string }) =>
  http.request<Resp<{ list: Model[] }>>("get", "/dept/list", {
    params: data
  });

/** 更新部门 */
export const uptApi = (id: number, data: Partial<Model>) =>
  http.request<Resp<null>>("put", `/dept/${id}`, { data });

/** 删除部门 */
export const delApi = (id: number) =>
  http.request<Resp<null>>("delete", `/dept/${id}`);
