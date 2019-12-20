<template lang="pug">
label.field(:class="{focus}")
  .label
    font-awesome-icon.icon(v-if="icon" :icon="icon")
    span {{label}}
  input(:value="value" :type="type" :placeholder="placeholder" :required="required" :disabled="disabled" :autofocus="autofocus" @input="input" @focus="focus = true" @blur="focus = false")
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'TextInput',
  props: {
    value: {
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
  data() {
    return {
      focus: false
    }
  },
  methods: {
    input(evt: Event): void {
      this.$emit('input', (evt.target as HTMLInputElement).value)
    }
  }
})
</script>
