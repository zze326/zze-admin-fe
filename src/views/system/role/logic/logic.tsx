import editForm from "../form.vue";
import { addDialog } from "@/components/ReDialog";
import { FormDataProps, Permiss } from "./types";
import { initValues } from "./form";
import { h, ref, onMounted, reactive } from "vue";
import { FormInstance } from "element-plus";
import { message } from "@/utils/message";
import { addApi, uptApi, getPageLstApi, delApi } from "@/api/system/role";
import { ReqPagerData } from "@/utils/pager";
import { PaginationProps } from "@pureadmin/table";
import { useStore } from "./store";
import { hasAuth } from "@/router/utils";

export const useLogic = () => {
  const formRef = ref();
  const loading = ref(false);
  const dataList = ref([]);
  const store = useStore();

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    // {
    //   label: "编号",
    //   prop: "id"
    // },
    {
      label: "名称",
      prop: "name"
    },
    {
      label: "代码",
      prop: "code"
    },
    {
      label: "更新时间",
      prop: "updatedAt"
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation",
      hide: !hasAuth([Permiss.UPT, Permiss.DEL], true)
    }
  ];

  const onSearch = async () => {
    if (!hasAuth(Permiss.READ)) return;
    loading.value = true;
    const { data } = await getPageLstApi(
      new ReqPagerData(
        pagination.currentPage,
        pagination.pageSize,
        queryFormData.search,
        { enabled: queryFormData.enabled }
      )
    );
    dataList.value = data.list;
    pagination.total = data.total;
    loading.value = false;
  };

  // 打开新增、编辑框
  const openDialog = async (title = "新增", row?: FormDataProps) => {
    addDialog({
      title: `${title}角色`,
      props: {
        formData: initValues(row),
        roleList: []
      },
      width: "26%",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: async (done, { options }) => {
        const ok = await (formRef.value.getRef() as FormInstance).validate();
        const formData = options.props.formData as FormDataProps;
        const chores = (result: Resp<null>) => {
          if (result.code !== 0) {
            message(result.message, { type: "error" });
            return;
          }
          message(`您${title}了名称为 ${formData.name} 的这条数据`, {
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
    queryFormData.enabled = null;
    queryFormData.search = "";
    store.current = {};
    onSearch();
  };

  const queryFormData = reactive({ search: "", enabled: null });

  const handleDelete = async (row: FormDataProps) => {
    const res = await delApi(row.id);
    if (res.code !== 0) {
      message(res.message, { type: "error" });
      return;
    }
    message(`您删除了名称为 ${row.name} 的这条数据`, { type: "success" });
    onSearch();
  };

  const handleCurrentChange = (row: FormDataProps) => {
    store.current = row;
  };

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    dataList,
    columns,
    queryFormData,
    pagination,
    openDialog,
    onSearch,
    resetForm,
    handleDelete,
    handleCurrentChange
  };
};
