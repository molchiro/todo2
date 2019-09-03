<template lang="pug">
  v-app-bar(
    color="primary"
    dark
    app
  )
    v-app-bar-nav-icon(
      v-if="showSideIcon"
      @click.stop="toggleSideNav"
    )
    v-toolbar-title Todo List
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class ToolBar extends Vue {
  @Prop({ default: true }) readonly showSideIcon: boolean

  toggleSideNav(): void {
    this.$emit('toggleSideNav')
  }
}
</script>
