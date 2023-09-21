import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { FormDataProps } from "./types";

/** 自定义表单规则校验 */
export const rules = reactive(<FormRules>{
  name: [{ required: true, message: "名称为必填项", trigger: "blur" }],
  code: [{ required: true, message: "代码为必填项", trigger: "blur" }]
});

export const initValues = (row?: FormDataProps): FormDataProps => {
  return {
    name: row?.name ?? "",
    code: row?.code ?? ""
  };
};
