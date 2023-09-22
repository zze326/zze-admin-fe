import { http } from "@/utils/http";

export type Model = {
  id: number;
  name: string;
  code: string;
  permission: number[];
  updatedAt: string;
};

/** 新增角色 */
export const addApi = (data: Partial<Model>) =>
  http.request<Resp<null>>("post", "/role", { data });

/** 分页获取角色列表 */
export const getPageLstApi = (data: IReqPagerData) =>
  http.request<Resp<IRespPagerData<Model>>>("get", "/role/page-list", {
    params: data
  });

/** 更新角色 */
export const uptApi = (id: number, data: Partial<Model>) =>
  http.request<Resp<null>>("put", `/role/${id}`, { data });

/** 删除角色 */
export const delApi = (id: number) =>
  http.request<Resp<null>>("delete", `/role/${id}`);

/** 更新角色的权限信息 */
export const UptPermissionApi = (id: number, permissionIds: number[]) =>
  http.request<Resp<null>>("patch", `/role/${id}/permission`, {
    data: { permissionIds }
  });

/** 获取所有角色列表 */
export const getLstApi = () =>
  http.request<Resp<{ list: Partial<Model>[] }>>("get", "/role/list");
