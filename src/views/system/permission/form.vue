<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import IconSelect from "@/components/ReIcon/src/Select.vue";
import { EType, FormProps } from "./logic/types";
import { initValues, dynamicRules } from "./logic/form";
import { handleTree } from "@/utils/tree";
import { ETypeModel } from "./logic/types";

const props = withDefaults(defineProps<FormProps>(), {
  formData: () => initValues(),
  list: []
});

const formRef = ref();
const formData = ref(props.formData);
formData.value.showParent = formData.value.parentId
  ? formData.value.showParent
  : false;
const getRef = () => formRef.value;

const handleParentChange = val => {
  val ?? (formData.value.showParent = false);
};
const isSystemRequired = formData.value.name === "system-required";
const treeList = handleTree(props.list);
defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="dynamicRules(formData, props.list)"
    label-width="92px"
  >
    <el-row :gutter="30">
      <re-col :value="15" :xs="24" :sm="24">
        <el-form-item label="上级权限" prop="parentId">
          <el-cascader
            class="w-full"
            v-model="formData.parentId"
            :options="treeList"
            :props="{
              value: 'id',
              label: 'title',
              emitPath: false,
              checkStrictly: true
            }"
            :disabled="isSystemRequired"
            @change="handleParentChange"
            clearable
            filterable
            placeholder="请选择上级权限"
          >
            <template #default="{ node, data }">
              <span>{{ data.title }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </re-col>
      <re-col :value="9" :xs="24" :sm="24">
        <el-form-item label="权限类型" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio-button
              :disabled="isSystemRequired"
              v-for="item in ETypeModel.getEnumList()"
              :key="item.value"
              :label="item.value"
              >{{ item.display }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="权限标题" prop="title">
          <el-input
            show-word-limit
            maxlength="30"
            :disabled="isSystemRequired"
            v-model="formData.title"
            clearable
            placeholder="请输入权限标题"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="权限名称" prop="name">
          <el-input
            show-word-limit
            :disabled="isSystemRequired"
            maxlength="30"
            v-model="formData.name"
            clearable
            placeholder="请输入权限名称"
          />
        </el-form-item>
      </re-col>
      <re-col
        :value="12"
        :xs="24"
        :sm="24"
        v-if="[EType.DIR, EType.MENU].includes(formData.type)"
      >
        <el-form-item label="前端路由" prop="fRoute">
          <el-input
            show-word-limit
            maxlength="64"
            v-model="formData.fRoute"
            clearable
            placeholder="请输入前端路由"
          />
        </el-form-item>
      </re-col>
      <re-col
        :value="12"
        :xs="24"
        :sm="24"
        v-if="[EType.DIR].includes(formData.type)"
      >
        <el-form-item label="重定向路径" prop="redirect">
          <el-input
            show-word-limit
            maxlength="64"
            v-model="formData.redirect"
            clearable
            placeholder="请输入重定向路径"
          />
        </el-form-item>
      </re-col>
      <re-col
        :value="12"
        :xs="24"
        :sm="24"
        v-if="[EType.DIR, EType.MENU].includes(formData.type)"
      >
        <el-form-item label="图标" prop="icon">
          <IconSelect v-model="formData.icon" />
        </el-form-item>
      </re-col>
      <re-col :value="8" :xs="24" :sm="24">
        <el-form-item label="排序" prop="rank">
          <el-input-number
            v-model="formData.rank"
            :disabled="isSystemRequired"
            :min="0"
            :max="9999"
            controls-position="right"
          />
        </el-form-item>
      </re-col>
      <re-col :xs="24" :sm="24">
        <el-form-item
          label="后端路由"
          prop="bRoutes"
          v-if="[EType.ABLE].includes(formData.type)"
        >
          <el-select
            class="w-[100%]"
            v-model="formData.bRoutes"
            multiple
            filterable
            allow-create
            default-first-option
            :reserve-keyword="false"
            placeholder="请输入后端路由"
          />
        </el-form-item>
      </re-col>
      <re-col
        :value="8"
        :xs="24"
        :sm="24"
        v-if="[EType.DIR, EType.MENU].includes(formData.type)"
      >
        <el-form-item label="显示在菜单" prop="showLink">
          <el-switch
            v-model="formData.showLink"
            inline-prompt
            :active-value="true"
            :inactive-value="false"
            active-text="是"
            inactive-text="否"
          />
        </el-form-item>
      </re-col>
      <re-col
        :value="8"
        :xs="24"
        :sm="24"
        v-if="[EType.MENU].includes(formData.type)"
      >
        <el-form-item label="显示父菜单" prop="showParent">
          <el-switch
            :disabled="!formData.parentId"
            v-model="formData.showParent"
            inline-prompt
            :active-value="true"
            :inactive-value="false"
            active-text="是"
            inactive-text="否"
          />
        </el-form-item>
      </re-col>

      <re-col
        :value="8"
        :xs="24"
        :sm="24"
        v-if="[EType.MENU].includes(formData.type)"
      >
        <el-form-item label="缓存页面" prop="keepAlive">
          <el-switch
            v-model="formData.keepAlive"
            inline-prompt
            :active-value="true"
            :inactive-value="false"
            active-text="是"
            inactive-text="否"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
