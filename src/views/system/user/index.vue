<script setup lang="ts">
import { ref } from "vue";
import tree from "./dept-tree.vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import AddFill from "@iconify-icons/ri/add-circle-line";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import Key from "@iconify-icons/ep/key";
import { useLogic } from "./logic/logic";
import { Permiss } from "./logic/types";
import { hasAuth } from "@/router/utils";

defineOptions({
  name: "user-manage"
});

const queryFormRef = ref();

const {
  loading,
  dataList,
  columns,
  queryFormData,
  pagination,
  deptTreeList,
  deptTreeLoading,
  openDialog,
  openResetPwdDialog,
  onSearch,
  resetForm,
  handleDelete,
  onDeptTreeSelect
} = useLogic();
</script>
<template>
  <div class="flex justify-between">
    <tree
      ref="treeRef"
      class="min-w-[200px] mr-2"
      :treeData="deptTreeList"
      :treeLoading="deptTreeLoading"
      @tree-select="onDeptTreeSelect"
    />
    <div class="w-[calc(100%-200px)]">
      <el-form
        ref="queryFormRef"
        v-auth="Permiss.READ"
        :inline="true"
        :model="queryFormData"
        @submit.prevent
        class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
      >
        <el-form-item label="用户名：" prop="search">
          <el-input
            v-model="queryFormData.search"
            placeholder="请输入用户名"
            clearable
            class="!w-[200px]"
          />
        </el-form-item>
        <el-form-item label="状态：" prop="enabled">
          <el-select
            v-model="queryFormData.enabled"
            placeholder="请选择状态"
            clearable
            class="!w-[180px]"
          >
            <el-option label="已启用" :value="true" />
            <el-option label="已停用" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="useRenderIcon(Search)"
            :loading="loading"
            @click="onSearch"
          >
            搜索
          </el-button>
          <el-button
            :icon="useRenderIcon(Refresh)"
            @click="resetForm(queryFormRef)"
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <PureTableBar title="用户列表" :columns="columns" @refresh="onSearch">
        <template #buttons>
          <el-button
            v-auth="Permiss.ADD"
            type="primary"
            :icon="useRenderIcon(AddFill)"
            @click="openDialog()"
          >
            新增用户
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            align-whole="center"
            showOverflowTooltip
            table-layout="auto"
            :loading="loading"
            :size="size"
            adaptive
            :data="dataList"
            :empty-text="hasAuth(Permiss.READ) ? '暂无数据' : '权限不足'"
            :columns="dynamicColumns"
            :pagination="pagination"
            :paginationSmall="size === 'small' ? true : false"
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)'
            }"
          >
            <template #operation="{ row }">
              <el-button
                class="reset-margin"
                link
                v-auth="Permiss.UPT_PWD"
                type="warning"
                :size="size"
                :icon="useRenderIcon(Key)"
                @click="openResetPwdDialog(row)"
              >
                重置密码
              </el-button>
              <el-button
                class="reset-margin"
                link
                v-auth="Permiss.UPT"
                type="primary"
                :size="size"
                :icon="useRenderIcon(EditPen)"
                @click="openDialog('编辑', row)"
              >
                修改
              </el-button>
              <Auth :value="Permiss.DEL">
                <el-popconfirm
                  :title="`是否确认删除用户名为 ${row.username} 的这条数据`"
                  @confirm="handleDelete(row)"
                >
                  <template #reference>
                    <el-button
                      class="reset-margin"
                      :disabled="row.username === 'admin'"
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon(Delete)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </Auth>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
