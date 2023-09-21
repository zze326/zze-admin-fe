import { getLstApi } from "@/api/system/permission";
import { ref, onMounted, Ref, watch } from "vue";
import { handleTree } from "@/utils/tree";
import { ElTree, TreeNode } from "element-plus";
import { useStore } from "../logic/store";
import { UptPermissionApi } from "@/api/system/role";
import { message } from "@/utils/message";
import { hasAuth } from "@/router/utils";
import { Permiss } from "./types";

export const useLogic = (treeRef: Ref<InstanceType<typeof ElTree>>) => {
  interface treeNode extends TreeNode {
    title: string;
  }
  const dataList = ref([]);
  const store = useStore();

  const dataProps = ref({
    value: "id",
    children: "children"
  });

  const getList = async () => {
    if (!hasAuth(Permiss.READ)) return;
    const { data } = await getLstApi(null);
    dataList.value = handleTree(data.list);
  };

  const filterMethod = (query: string, node: treeNode) => {
    return node.title!.indexOf(query) !== -1;
  };
  const onQueryChanged = (query: string) => {
    treeRef.value!.filter(query);
  };

  const handleSavePermission = async () => {
    const checkIds = treeRef.value.getCheckedKeys() as number[];
    await UptPermissionApi(store.current.id, checkIds);
    store.current.permission = checkIds;
    message(`您成功更新了角色 ${store.current.name} 的权限`, {
      type: "success"
    });
  };

  watch(
    () => store.current,
    () => {
      if (!store.current) return;
      treeRef.value.setCheckedKeys(store.current.permission ?? []);
    }
  );

  onMounted(() => {
    getList();
    store.current = null;
  });

  return {
    dataList,
    dataProps,
    filterMethod,
    onQueryChanged,
    handleSavePermission,
    store
  };
};
