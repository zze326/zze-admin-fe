import editForm from "../form.vue";
import { addDialog } from "@/components/ReDialog";
import { FormItemProps, Permiss } from "./types";
import { initValues } from "./form";
import { h, ref, onMounted, reactive } from "vue";
import { FormInstance } from "element-plus";
import { message } from "@/utils/message";
import { addApi, uptApi, getLstApi, delApi } from "@/api/system/dept";
import { handleTree } from "@/utils/tree";
import { hasAuth } from "@/router/utils";

export const useLogic = () => {
  const formRef = ref();
  const loading = ref(false);
  const dataList = ref([]);

  const columns: TableColumnList = [
    {
      label: "部门名称",
      prop: "name",
      align: "left"
    },
    {
      label: "排序",
      prop: "rank",
      minWidth: 80
    },
    {
      label: "更新时间",
      prop: "updatedAt"
    },
    {
      label: "操作",
      fixed: "right",
      width: 220,
      slot: "operation",
      hide: !hasAuth([Permiss.UPT, Permiss.DEL], true)
    }
  ];

  const onSearch = async () => {
    if (!hasAuth(Permiss.READ)) return;
    loading.value = true;
    const { data } = await getLstApi(queryFormData);
    dataList.value = handleTree(data.list);
    loading.value = false;
  };

  // 打开新增、编辑框
  const openDialog = async (title = "新增", row?: FormItemProps) => {
    const { data } = await getLstApi(null);
    if (title === "编辑" && row) {
      const dst = data.list.find(item => item.id === row.id);
      Object.assign(dst, { disabled: true });
    }

    addDialog({
      title: `${title}部门`,
      props: {
        formData: initValues(row),
        list: data.list
      },
      width: "26%",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: async (done, { options }) => {
        const ok = await (formRef.value.getRef() as FormInstance).validate();
        const formData = options.props.formData as FormItemProps;
        const chores = (result: Resp<null>) => {
          if (result.code !== 0) {
            message(result.message, { type: "error" });
            return;
          }
          message(`您${title}了部门名称为 ${formData.name} 的这条数据`, {
            type: "success"
          });

          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        };
        if (!ok) {
          return;
        }

        chores(
          title === "新增"
            ? await addApi(formData)
            : await uptApi(row.id, formData)
        );
      }
    });
  };

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    queryFormData.search = "";
    onSearch();
  };

  const queryFormData = reactive({ search: "" });

  const handleDelete = async (row: FormItemProps) => {
    const res = await delApi(row.id);
    if (res.code !== 0) {
      message(res.message, { type: "error" });
      return;
    }
    message(`您删除了部门名称为 ${row.name} 的这条数据`, { type: "success" });
    onSearch();
  };

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    dataList,
    columns,
    queryFormData,
    openDialog,
    onSearch,
    resetForm,
    handleDelete
  };
};
