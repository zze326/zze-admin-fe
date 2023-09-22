import { Model } from "@/api/system/user";
import { Model as RoleModel } from "@/api/system/role";
import { Model as DeptModel } from "@/api/system/dept";
type FormDataProps = Partial<Model>;

type ResetPwdFormDataProps = {
  password: string;
  passwordConfirm: string;
};

interface FormProps {
  formData: FormDataProps;
  roleList: RoleModel[];
  deptTreeList: DeptModel[];
}

interface ResetPwdFormProps {
  formData: ResetPwdFormDataProps;
}

export enum Permiss {
  READ = "user-read",
  ADD = "user-add",
  UPT = "user-upt",
  DEL = "user-del",
  UPT_PWD = "user-upt-password",
  UPT_ENABLE = "user-upt-enable"
}

export type {
  FormDataProps,
  ResetPwdFormDataProps,
  FormProps,
  ResetPwdFormProps
};
