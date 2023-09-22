import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { FormDataProps, ResetPwdFormDataProps } from "./types";

/** 自定义表单规则校验 */
export const rules = reactive(<FormRules>{
  username: [{ required: true, message: "用户名为必填项", trigger: "blur" }],
  realName: [{ required: true, message: "真实姓名为必填项", trigger: "blur" }],
  deptId: [{ required: true, message: "所属部门为必填项", trigger: "blur" }],
  phone: [
    { pattern: /^1\d{10}$/, message: "电话号码格式不正确", trigger: "blur" }
  ],
  email: [
    {
      pattern: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
      message: "邮箱格式不正确",
      trigger: "blur"
    }
  ]
});

export const initValues = (row?: FormDataProps): FormDataProps => {
  return {
    username: row?.username ?? "",
    realName: row?.realName ?? "",
    phone: row?.phone ?? "",
    email: row?.email ?? "",
    deptId: row?.deptId ?? null,
    enabled: row?.enabled ?? false,
    roleIds: row?.roleIds ?? []
  };
};

export const initResetPwdFormValues = (): ResetPwdFormDataProps => {
  return {
    password: "",
    passwordConfirm: ""
  };
};
