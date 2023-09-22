import editForm from "../form/form.vue";
import resetPwdForm from "../form/reset-pwd.vue";
import { addDialog } from "@/components/ReDialog";
import { FormDataProps, ResetPwdFormDataProps, Permiss } from "./types";
import { hasAuth } from "@/router/utils";
import { initValues } from "./form";
import { h, ref, onMounted, reactive } from "vue";
import { FormInstance, ElMessageBox } from "element-plus";
import { message } from "@/utils/message";
import {
  addApi,
  uptApi,
  getLstApi,
  delApi,
  uptEnabled,
  uptPassword
} from "@/api/system/user";
import { getLstApi as getDeptLstApi } from "@/api/system/dept";
import { getLstApi as getRoleLstApi } from "@/api/system/role";
import { useCommonLogic } from "@/utils/common";
import { ReqPagerData } from "@/utils/pager";
import { PaginationProps } from "@pureadmin/table";
import { handleTree } from "@/utils/tree";

export const useLogic = () => {
  const formRef = ref();
  const loading = ref(false);
  const dataList = ref([]);
  const deptTreeLoading = ref(false);
  const deptTreeList = ref([]);
  const switchLoadMap = ref({});
  const { switchStyle } = useCommonLogic();

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
      label: "用户名",
      prop: "username"
    },
    {
      label: "真实姓名",
      prop: "realName"
    },
    {
      label: "电话",
      prop: "phone"
    },
    {
      label: "邮箱",
      prop: "email"
    },
    {
      label: "更新时间",
      prop: "updatedAt"
    },
    {
      label: "是否启用",
      prop: "enabled",
      hide: !hasAuth(Permiss.UPT_ENABLE),
      cellRenderer: scope => (
        <el-switch
          disabled={scope.row.username === "admin"}
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.enabled}
          active-value={true}
          inactive-value={false}
          active-text="是"
          style={switchStyle.value}
          inactive-text="否"
          inline-prompt
          onChange={() => onChange(scope as any)}
        />
      )
    },
    {
      label: "操作",
      fixed: "right",
      width: 240,
      slot: "operation",
      hide: !hasAuth([Permiss.UPT_PWD, Permiss.UPT, Permiss.DEL], true)
    }
  ];

  const onSearch = async () => {
    if (!hasAuth(Permiss.READ)) return;
    const { data } = await getLstApi(
      new ReqPagerData(
        pagination.currentPage,
        pagination.pageSize,
        queryFormData.search,
        {
          enabled: queryFormData.enabled,
          deptId: queryFormData.deptId
        }
      )
    );
    dataList.value = data.list;
    pagination.total = data.total;
    loading.value = false;
  };

  // 重置密码
  const openResetPwdDialog = async (row?: FormDataProps) => {
    const formRef = ref();
    addDialog({
      title: `重置 ${row.username} 的密码`,
      props: {
        formData: initValues()
      },
      width: "26%",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(resetPwdForm, { ref: formRef }),
      beforeSure: async (done, { options }) => {
        const ok = await (formRef.value.getRef() as FormInstance).validate();
        const formData = options.props.formData as ResetPwdFormDataProps;
        const chores = (result: Resp<null>) => {
          if (result.code !== 0) {
            message(result.message, { type: "error" });
            return;
          }
          message(`您重置了用户名为 ${row.username} 的密码`, {
            type: "success"
          });

          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        };
        if (!ok) {
          return;
        }

        chores(await uptPassword(row.id, formData.passwordConfirm));
      }
    });
  };

  // 打开新增、编辑框
  const openDialog = async (title = "新增", row?: FormDataProps) => {
    const res = await getRoleLstApi();
    addDialog({
      title: `${title}用户`,
      props: {
        formData: initValues(row),
        roleList: res.data.list,
        deptTreeList
      },
      width: "46%",
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
          if (title === "新增") {
            message(
              `您${title}了用户名为 ${formData.username} 的这条数据，默认密码为 devops.123`,
              {
                type: "success"
              }
            );
          } else {
            message(`您${title}了用户名为 ${formData.username} 的这条数据`, {
              type: "success"
            });
          }

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

  // 停用、启用是否显示在菜单
  const onChange = async ({ row, index }) => {
    const confirm =
      (await ElMessageBox.confirm(
        `确认要<strong>${
          row.enabled ? "启用" : "停用"
        }</strong> <strong style='color:var(--el-color-primary)'>${
          row.username
        }</strong> 吗?`,
        "系统提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          dangerouslyUseHTMLString: true,
          draggable: true
        }
      ).catch(_ => false)) == "confirm";
    if (!confirm) {
      row.enabled = !row.enabled;
      return;
    }
    switchLoadMap.value[index] = Object.assign({}, switchLoadMap.value[index], {
      loading: true
    });

    const res = await uptEnabled(row.id, row.enabled);
    switchLoadMap.value[index] = Object.assign({}, switchLoadMap.value[index], {
      loading: false
    });
    if (res.code !== 0) {
      message(res.message, {
        type: "error"
      });
      row.enabled = !row.enabled;
      return;
    } else {
      message(`已${row.enabled ? "启用" : "停用"}用户 ${row.username}`, {
        type: "success"
      });
    }
  };

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  const queryFormData = reactive({ search: "", enabled: null, deptId: null });

  const handleDelete = async (row: FormDataProps) => {
    const res = await delApi(row.id);
    if (res.code !== 0) {
      message(res.message, { type: "error" });
      return;
    }
    message(`您删除了用户名为 ${row.username} 的这条数据`, { type: "success" });
    onSearch();
  };

  const getDeptTree = async () => {
    deptTreeLoading.value = true;
    const res = await getDeptLstApi(null);
    deptTreeList.value = handleTree(res.data.list);
    deptTreeLoading.value = false;
  };

  const onDeptTreeSelect = ({ id, selected }) => {
    queryFormData.deptId = selected ? id : null;
    onSearch();
  };

  onMounted(() => {
    if (!hasAuth(Permiss.READ)) return;
    onSearch();
    getDeptTree();
  });

  return {
    loading,
    dataList,
    columns,
    queryFormData,
    pagination,
    deptTreeLoading,
    deptTreeList,
    openDialog,
    onSearch,
    resetForm,
    handleDelete,
    openResetPwdDialog,
    onDeptTreeSelect
  };
};
