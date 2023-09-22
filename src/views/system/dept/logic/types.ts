import { Model } from "@/api/system/dept";
type FormItemProps = Partial<Model>;

interface FormProps {
  formData: FormItemProps;
  list: any;
}

export type { FormItemProps, FormProps };

export enum Permiss {
  READ = "dept-read",
  ADD = "dept-add",
  UPT = "dept-upt",
  DEL = "dept-del"
}
