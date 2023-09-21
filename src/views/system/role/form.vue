<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { FormProps } from "./logic/types";
import { rules, initValues } from "./logic/form";

const props = withDefaults(defineProps<FormProps>(), {
  formData: () => initValues()
});

const formRef = ref();
const formData = ref(props.formData);

const getRef = () => formRef.value;
defineExpose({ getRef });
</script>

<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="82px">
    <el-row :gutter="30">
      <re-col :xs="24" :sm="24">
        <el-form-item label="名称" prop="name">
          <el-input
            show-word-limit
            maxlength="30"
            v-model="formData.name"
            clearable
            placeholder="请输入角色名称"
          />
        </el-form-item>
      </re-col>
      <re-col :xs="24" :sm="24">
        <el-form-item label="代码" prop="code">
          <el-input
            show-word-limit
            maxlength="30"
            v-model="formData.code"
            clearable
            placeholder="请输入角色代码"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
