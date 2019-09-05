<template lang="pug">
  v-app
    the-app-bar(:showSideIcon="false")
    v-content
      v-container
        nuxt
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import TheAppBar from '@/components/TheAppBar.vue'

@Component({
  components: {
    TheAppBar
  }
})
export default class titleOnlyLayout extends Vue {}
</script>
