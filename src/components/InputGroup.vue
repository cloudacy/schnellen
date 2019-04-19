<template lang="pug">
.input-group.d-flex
  div
    v-icon.icon-big(:name="icon" center right)
  .f-1
    slot
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'InputGroup',
  props: {
    icon: {
      type: String,
      required: true
    }
  }
})
</script>
