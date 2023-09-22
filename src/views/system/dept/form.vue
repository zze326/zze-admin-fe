<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { FormProps } from "./logic/types";
import { initValues, rules } from "./logic/form";
import { handleTree } from "@/utils/tree";

const props = withDefaults(defineProps<FormProps>(), {
  formData: () => initValues(),
  list: []
});

const formRef = ref();
const formData = ref(props.formData);

const getRef = () => formRef.value;

const treeList = handleTree(props.list);
defineExpose({ getRef });
</script>

<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="92px">
    <el-row :gutter="30">
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader
            class="w-full"
            v-model="formData.parentId"
            :options="treeList"
            :props="{
              value: 'id',
              label: 'name',
              emitPath: false,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="请选择上级部门"
          >
            <template #default="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </re-col>

      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="部门名称" prop="name">
          <el-input
            show-word-limit
            maxlength="30"
            v-model="formData.name"
            clearable
            placeholder="请输入部门名称"
          />
        </el-form-item>
      </re-col>

      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="排序" prop="rank">
          <el-input-number
            v-model="formData.rank"
            :min="0"
            :max="9999"
            controls-position="right"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
