import { defineComponent, Fragment } from "vue";
import { hasAuth } from "@/router/utils";

export default defineComponent({
  name: "Auth",
  props: {
    value: {
      type: undefined,
      default: []
    },
    intersection: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { slots }) {
    return () => {
      if (!slots) return null;
      return hasAuth(props.value, props.intersection) ? (
        <Fragment>{slots.default?.()}</Fragment>
      ) : null;
    };
  }
});
