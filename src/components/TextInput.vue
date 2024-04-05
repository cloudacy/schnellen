<template>
  <label class="field" :class="{focus}">
    <div class="label">
      <font-awesome-icon class="icon" v-if="icon" :icon="icon" />
      <span>{{ label }}</span>
    </div>
    <input
      ref="input"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :autofocus="autofocus"
      v-model="model"
      @focus="focus = true"
      @blur="focus = false"
    />
  </label>
</template>

<script lang="ts" setup>
import {ref} from 'vue'

defineProps({
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
})

const model = defineModel<string | number>({required: true})

const focus = ref(false)

const input = ref<HTMLInputElement>()

defineExpose({input})
</script>
