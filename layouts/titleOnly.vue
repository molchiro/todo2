<template lang="pug">
  v-app
    the-app-bar(:showSideIcon="false")
    v-content
      nuxt
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import TheAppBar from '@/components/TheAppBar.vue'

@Component({
  components: {
    TheAppBar
  }
})
export default class titleOnlyLayout extends Vue {}
</script>
