import { defineStore } from "pinia";
import { FormDataProps } from "./types";

export const useStore = defineStore("role-manage", {
  state: () => {
    return {
      current: <FormDataProps>null
    };
  },
  getters: {},
  actions: {
    // handleCollapse() {
    //   this.collapse = !this.collapse;
    // }
  }
});
