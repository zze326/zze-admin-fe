import editForm from "../form.vue";
import { addDialog } from "@/components/ReDialog";
import { FormItemProps, ETypeModel, EType, Permiss } from "./types";
import { initValues } from "./form";
import { h, ref, onMounted, reactive } from "vue";
import { FormInstance, ElMessageBox } from "element-plus";
import { message } from "@/utils/message";
import {
  addApi,
  uptApi,
  getLstApi,
  uptShowLinkApi,
  delApi
} from "@/api/system/permission";
import { useCommonLogic } from "@/utils/common";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { handleTree } from "@/utils/tree";
import { copyTextToClipboard } from "@pureadmin/utils";
import { hasAuth } from "@/router/utils";

export const useLogic = () => {
  const formRef = ref();
  const loading = ref(false);
  const dataList = ref([]);
  const switchLoadMap = ref({});
  const { switchStyle } = useCommonLogic();

  const columns: TableColumnList = [
    {
      label: "权限标题",
      prop: "title",
      align: "left",
      minWidth: 180
    },
    {
      label: "权限名称",
      prop: "name",
      minWidth: 180,
      align: "left",
      cellRenderer: scope => (
        <el-tag
          class="cursor-pointer"
          onclick={() => handleNameTagClick(scope.row.name)}
          type="info"
        >
          {scope.row.name}
        </el-tag>
      )
    },
    {
      label: "类型",
      prop: "type",
      formatter: (row: FormItemProps) => ETypeModel.displayOf(row.type)
    },
    {
      label: "图标",
      prop: "icon",
      align: "center",
      minWidth: 80,
      cellRenderer: scope => (
        <p class="flex justify-center">{h(useRenderIcon(scope.row.icon))}</p>
      )
    },
    {
      label: "排序",
      prop: "rank",
      minWidth: 80
    },
    {
      label: "是否显示在菜单",
      prop: "showLink",
      width: 150,
      hide: !hasAuth(Permiss.UPT_SHOW_LINK),
      cellRenderer: scope => {
        if ([EType.DIR, EType.MENU].includes(scope.row.type)) {
          return (
            <el-switch
              size={scope.props.size === "small" ? "small" : "default"}
              loading={switchLoadMap.value[scope.index]?.loading}
              v-model={scope.row.showLink}
              active-value={true}
              inactive-value={false}
              active-text="是"
              style={switchStyle.value}
              inactive-text="否"
              inline-prompt
              onChange={() => onChange(scope as any)}
            />
          );
        } else {
          return null;
        }
      }
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

  const handleNameTagClick = (val: string) => {
    copyTextToClipboard(val);
    message(`已复制 ${val} 到剪切板`, {
      type: "success"
    });
  };

  // 打开新增、编辑框
  const openDialog = async (title = "新增", row?: FormItemProps) => {
    const { data } = await getLstApi(null);
    if (title === "编辑" && row) {
      const dst = data.list.find(item => item.id === row.id);
      Object.assign(dst, { disabled: true });
    }

    addDialog({
      title: `${title}权限`,
      props: {
        formData: initValues(row),
        list: data.list
      },
      width: "46%",
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
          message(`您${title}了权限标题为 ${formData.title} 的这条数据`, {
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

  // 停用、启用是否显示在菜单
  const onChange = async ({ row, index }) => {
    const confirm =
      (await ElMessageBox.confirm(
        `确认要<strong>${
          row.showLink ? "启用" : "停用"
        }</strong> <strong style='color:var(--el-color-primary)'>${
          row.title
        }</strong> 显示在菜单吗?`,
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
      row.showLink = !row.showLink;
      return;
    }
    switchLoadMap.value[index] = Object.assign({}, switchLoadMap.value[index], {
      loading: true
    });

    const res = await uptShowLinkApi(row.id, row.showLink);
    switchLoadMap.value[index] = Object.assign({}, switchLoadMap.value[index], {
      loading: false
    });
    if (res.code !== 0) {
      message(res.message, {
        type: "error"
      });
      row.showLink = !row.showLink;
      return;
    } else {
      message(`已${row.showLink ? "启用" : "停用"} ${row.title} 显示在菜单`, {
        type: "success"
      });
    }
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
    message(`您删除了权限标题为 ${row.name} 的这条数据`, { type: "success" });
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
