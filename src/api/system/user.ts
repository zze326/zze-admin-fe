import { http } from "@/utils/http";

export type Model = {
  id: number;
  username: string;
  realName: string;
  phone: string;
  email: string;
  enabled: boolean;
  roleIds: number[];
  deptId: number;
  updatedAt: string;
};

/** 新增用户 */
export const addApi = (data: Partial<Model>) =>
  http.request<Resp<null>>("post", "/user", { data });

/** 分页获取用户列表 */
export const getLstApi = (data: IReqPagerData) =>
  http.request<Resp<IRespPagerData<Model>>>("get", "/user/page-list", {
    params: data
  });

/** 更新用户 */
export const uptApi = (id: number, data: Partial<Model>) =>
  http.request<Resp<null>>("put", `/user/${id}`, { data });

/** 删除用户 */
export const delApi = (id: number) =>
  http.request<Resp<null>>("delete", `/user/${id}`);

/** 启用/禁用用户 */
export const uptEnabled = (id: number, enabled: boolean) =>
  http.request<Resp<null>>("patch", `/user/${id}/enabled`, {
    data: { enabled }
  });

/** 更新密码 */
export const uptPassword = (id: number, password: string) =>
  http.request<Resp<null>>("patch", `/user/${id}/password`, {
    data: { password }
  });
