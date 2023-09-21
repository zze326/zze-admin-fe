import { Model } from "@/api/system/role";
type FormDataProps = Partial<Model>;

interface FormProps {
  formData: FormDataProps;
}

export type { FormDataProps, FormProps };

export enum Permiss {
  READ = "role-read",
  ADD = "role-add",
  UPT = "role-upt",
  DEL = "role-del",
  UPT_PERMISSION = "role-upt-permission"
}
