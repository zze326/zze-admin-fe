<script setup lang="ts">
import { ref } from "vue";
import type { ElTree } from "element-plus";
import ElTreeLine from "@/components/ReTreeLine";
import { useLogic } from "./logic/permission";
import Save from "@iconify-icons/ri/save-3-fill";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { Permiss } from "./logic/types";
import { hasAuth } from "@/router/utils";

defineOptions({
  name: "MenuTree"
});

const query = ref("");
const treeRef = ref<InstanceType<typeof ElTree>>();

const {
  store,
  dataList,
  dataProps,
  filterMethod,
  onQueryChanged,
  handleSavePermission
} = useLogic(treeRef);
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header flex justify-between">
        <div class="relative top-1">
          <span v-if="store?.current?.name" class="font-medium">
            {{ store.current.name }}角色权限
          </span>
          <span v-else class="font-medium">当前未选择角色</span>
        </div>
        <el-button
          v-auth="Permiss.UPT_PERMISSION"
          :icon="useRenderIcon(Save)"
          @click="handleSavePermission"
          type="primary"
          :disabled="!store?.current?.name"
        >
          保存
        </el-button>
      </div>
    </template>

    <el-input
      class="mb-4"
      v-model="query"
      placeholder="请输入关键字查找"
      clearable
      @input="onQueryChanged"
    />
    <div class="overflow-y-scroll" style="height: calc(70vh - 10px)">
      <el-tree
        ref="treeRef"
        :data="dataList"
        :props="dataProps"
        :empty-text="hasAuth(Permiss.READ) ? '没有数据' : '权限不足'"
        show-checkbox
        :filter-node-method="filterMethod"
        default-expand-all
        :default-checked-keys="store.current?.permission"
        node-key="id"
      >
        <template v-slot:default="{ node }">
          <el-tree-line :node="node" :showLabelLine="true">
            <template v-slot:node-label>
              <span class="text-sm">
                {{ node.data.title }}
              </span>
            </template>
          </el-tree-line>
        </template>
      </el-tree>
    </div>
  </el-card>
</template>
