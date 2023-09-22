<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { FormProps } from "../logic/types";
import { rules, initValues } from "../logic/form";

const props = withDefaults(defineProps<FormProps>(), {
  formData: () => initValues(),
  roleList: null,
  deptTreeList: null
});

const formRef = ref();
const formData = ref(props.formData);
const isAdmin = formData.value.username === "admin";

const getRef = () => formRef.value;
defineExpose({ getRef });
</script>

<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="82px">
    <el-row :gutter="30">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="用户名" prop="username">
          <el-input
            show-word-limit
            maxlength="20"
            :disabled="isAdmin"
            v-model="formData.username"
            clearable
            placeholder="请输入用户名"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="真实姓名" prop="realName">
          <el-input
            show-word-limit
            maxlength="20"
            v-model="formData.realName"
            clearable
            placeholder="请输入真实姓名"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="所属部门" prop="deptId">
          <el-cascader
            class="w-full"
            v-model="formData.deptId"
            :options="deptTreeList"
            :props="{
              value: 'id',
              label: 'name',
              emitPath: false,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="请选择所属部门"
          >
            <template #default="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="角色" prop="roleIds">
          <el-select
            v-model="formData.roleIds"
            class="w-full"
            multiple
            :disabled="isAdmin"
            placeholder="请选择角色"
          >
            <el-option
              v-for="item in props.roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="电话号码" prop="phone">
          <el-input
            show-word-limit
            maxlength="20"
            v-model="formData.phone"
            clearable
            placeholder="请输入电话号码"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="邮箱" prop="email">
          <el-input
            show-word-limit
            maxlength="50"
            v-model="formData.email"
            clearable
            placeholder="请输入邮箱"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
