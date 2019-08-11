<template lang="pug">
  v-toolbar(color="indigo" dark fixed app)
    v-toolbar-side-icon(@click.stop="toggleSideNav")
    v-toolbar-title Todo List
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class ToolBar extends Vue {
  toggleSideNav(): void {
    this.$emit('toggleSideNav')
  }
}
</script>
