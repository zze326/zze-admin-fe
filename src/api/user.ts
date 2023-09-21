import { http } from "@/utils/http";

export type UserResult = {
  code: number;
  data: {
    /** 用户名 */
    username: string;
    /** 当前登陆用户的角色 */
    roles: Array<string>;
    /** `token` */
    token: string;
    /** `accessToken`的过期时间戳 */
    expires: number;
    /** 当前时间戳超过 refreshAfter 时刷新 token */
    refreshAfter: number;
  };
  message: string;
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", "/login", { data });
};

/** 刷新token */
export const refreshTokenApi = () => {
  return http.request<UserResult>("post", "/refresh-token");
};
