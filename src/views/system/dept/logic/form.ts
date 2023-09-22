import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { FormItemProps } from "./types";

export const rules = reactive(<FormRules>{
  name: [{ required: true, message: "部门标题为必填项", trigger: "blur" }],
  rank: [{ required: true, message: "排序为必填项", trigger: "blur" }]
});

export const initValues = (row?: FormItemProps): FormItemProps => {
  return {
    parentId: row.parentId ?? 0,
    name: row?.name ?? "",
    rank: row?.rank ?? 0
  };
};
