import { Model } from "@/api/system/permission";
import { EnumModel } from "@/utils/enum";
type FormItemProps = Partial<Model>;

interface FormProps {
  formData: FormItemProps;
  list: any;
}

export enum EType {
  DIR = 1,
  MENU = 2,
  ABLE = 3
}

export const ETypeModel = new EnumModel([
  { value: EType.DIR, display: "目录" },
  { value: EType.MENU, display: "菜单" },
  { value: EType.ABLE, display: "功能" }
]);

export type { FormItemProps, FormProps };

export enum Permiss {
  READ = "permission-read",
  ADD = "permission-add",
  UPT = "permission-upt",
  DEL = "permission-del",
  UPT_SHOW_LINK = "permission-upt-show-link"
}
