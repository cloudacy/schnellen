<template>
  <label class="field" :class="{focus}">
    <div class="label">
      <span class="icon" v-if="icon">i</span>
      <span>{{label}}</span>
    </div>
    <input :type="type" :value="modelValue" :placeholder="placeholder" :required="required" :disabled="disabled" :autofocus="autofocus" @input="input" @focus="focus = true" @blur="focus = false">
  </label>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'TextInput',
  props: {
    modelValue: {
      type: [String, Number],
      required: false
    },
    label: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: false
    },
    type: {
      type: String,
      required: false,
      default: 'text'
    },
    placeholder: {
      type: String,
      required: false,
      default: ''
    },
    required: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    autofocus: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup(props, ctx) {
    const focus = ref(false)

    const input = (evt: Event): void => {
      ctx.emit('update:modelValue', (evt.target as HTMLInputElement).value)
    }

    return {
      focus,
      input
    }
  }
})
</script>
