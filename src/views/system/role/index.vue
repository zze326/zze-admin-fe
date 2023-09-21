<script setup lang="ts">
import Role from "./role.vue";
import PermissionTree from "./permission-tree.vue";
import ReCol from "@/components/ReCol";
defineOptions({
  name: "role-manage"
});
</script>
<template>
  <div class="main">
    <el-row :gutter="30">
      <re-col :value="16" :xs="24" :sm="24">
        <Role />
      </re-col>
      <re-col :value="8" :xs="24" :sm="24">
        <PermissionTree />
      </re-col>
    </el-row>
  </div>
</template>
