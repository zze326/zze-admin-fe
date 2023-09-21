<script setup lang="ts">
import { ref, reactive } from "vue";
import ReCol from "@/components/ReCol";
import { ResetPwdFormProps } from "../logic/types";
import { initResetPwdFormValues } from "../logic/form";
import type { FormRules } from "element-plus";

const props = withDefaults(defineProps<ResetPwdFormProps>(), {
  formData: () => initResetPwdFormValues()
});

const formRef = ref();
const formData = ref(props.formData);

const getRef = () => formRef.value;

const rules = reactive<FormRules>({
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      pattern:
        /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,24}$/,
      message: "密码格式应为6-18位数字、字母、符号的任意两种组合",
      trigger: "blur"
    }
  ],
  passwordConfirm: [
    { required: true, message: "请再次输入密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value === formData.value.password) {
          callback(); // 验证通过
        } else {
          callback(new Error("两次密码不一致")); // 验证失败
        }
      },
      trigger: "blur"
    }
  ]
});
defineExpose({ getRef });
</script>

<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="82px">
    <el-row :gutter="30">
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="密码" prop="password">
          <el-input
            show-word-limit
            maxlength="24"
            type="password"
            v-model="formData.password"
            clearable
            placeholder="请输入密码"
          />
        </el-form-item>
      </re-col>
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="确认密码" prop="passwordConfirm">
          <el-input
            show-word-limit
            maxlength="24"
            type="password"
            v-model="formData.passwordConfirm"
            clearable
            placeholder="请确认密码"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
