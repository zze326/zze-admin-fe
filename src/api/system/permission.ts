import { http } from "@/utils/http";

export type Model = {
  id: number;
  title: string;
  name: string;
  type: number;
  fRoute: string;
  bRoutes: string[];
  redirect: string;
  icon: string;
  rank: number;
  showLink: boolean;
  showParent: boolean;
  keepAlive: boolean;
  parentId: number;
  auths?: string[];
};

/** 新增权限 */
export const addApi = (data: Partial<Model>) =>
  http.request<Resp<null>>("post", "/permission", { data });

/** 获取权限列表 */
export const getLstApi = (data: { search: string }) =>
  http.request<Resp<{ list: Model[] }>>("get", "/permission/list", {
    params: data
  });

/** 更新权限 */
export const uptApi = (id: number, data: Partial<Model>) =>
  http.request<Resp<null>>("put", `/permission/${id}`, { data });

/** 更新权限是否显示在菜单 */
export const uptShowLinkApi = (id: number, enabled: boolean) =>
  http.request<Resp<null>>("patch", `/permission/${id}/show-link`, {
    data: { enabled }
  });

/** 删除权限 */
export const delApi = (id: number) =>
  http.request<Resp<null>>("delete", `/permission/${id}`);

/** 获取前端路由列表 */
export const getRouteLstApi = () =>
  http.request<Resp<{ list: Model[] }>>("get", "/permission/route-list");
