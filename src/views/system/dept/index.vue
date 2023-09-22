<script setup lang="ts">
import { ref } from "vue";

import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import AddFill from "@iconify-icons/ri/add-circle-line";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Plus from "@iconify-icons/ep/plus";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import { useLogic } from "./logic/logic";
import { Permiss } from "./logic/types";
import { hasAuth } from "@/router/utils";

defineOptions({
  name: "dept-manage"
});

const tableRef = ref();
const queryFormRef = ref();

const {
  loading,
  dataList,
  columns,
  queryFormData,
  openDialog,
  onSearch,
  resetForm,
  handleDelete
} = useLogic();
</script>

<template>
  <div class="main">
    <el-form
      ref="queryFormRef"
      :model="queryFormData"
      v-auth="Permiss.READ"
      :inline="true"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
      @submit.prevent
    >
      <el-form-item label="部门名称：" prop="name">
        <el-input
          placeholder="请输入部门名称"
          v-model="queryFormData.search"
          clearable
          class="!w-[200px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
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

    <PureTableBar
      title="部门列表"
      :columns="columns"
      :tableRef="tableRef?.getTableRef()"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          type="primary"
          v-auth="Permiss.ADD"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog()"
        >
          新增部门
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          adaptive
          :adaptiveConfig="{ offsetBottom: 32 }"
          align-whole="center"
          row-key="id"
          :empty-text="hasAuth(Permiss.READ) ? '暂无数据' : '权限不足'"
          showOverflowTooltip
          table-layout="auto"
          default-expand-all
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              v-auth="Permiss.ADD"
              :size="size"
              :icon="useRenderIcon(Plus)"
              @click="
                openDialog('新增', {
                  parentId: row.id
                })
              "
            >
              新增
            </el-button>
            <el-button
              v-auth="Permiss.UPT"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="openDialog('编辑', row)"
            >
              编辑
            </el-button>
            <Auth :value="Permiss.DEL">
              <el-popconfirm
                :title="`是否确认删除部门标题为 ${row.title} 的这条数据`"
                @confirm="handleDelete(row)"
              >
                <template #reference>
                  <el-button
                    class="reset-margin"
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
</template>
