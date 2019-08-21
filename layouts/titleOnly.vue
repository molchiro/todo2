<template lang="pug">
  v-app
    the-tool-bar(:showSideIcon="false")
    v-content
      v-container
        nuxt
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import TheToolBar from '@/components/TheToolBar.vue'

@Component({
  components: {
    TheToolBar
  }
})
export default class titleOnlyLayout extends Vue {}
</script>
