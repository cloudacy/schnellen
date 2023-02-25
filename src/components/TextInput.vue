<template>
  <label class="field" :class="{focus}">
    <div class="label">
      <font-awesome-icon class="icon" v-if="icon" :icon="icon" />
      <span>{{ label }}</span>
    </div>
    <input ref="input" :type="type" :value="modelValue" :placeholder="placeholder" :required="required" :disabled="disabled" :autofocus="autofocus" @input="inputEvent" @focus="focus = true" @blur="focus = false" />
  </label>
</template>

<script lang="ts" setup>
import {ref} from 'vue'

const emit = defineEmits(['update:modelValue'])

defineProps({
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
})

const focus = ref(false)

const input = ref<HTMLInputElement>()

const inputEvent = (evt: Event): void => {
  emit('update:modelValue', (evt.target as HTMLInputElement).value)
}

defineExpose({input})
</script>
