<template lang="pug">
  v-app
    the-app-bar(@toggleSideNav="toggleSideNav")
    the-side-nav(v-model="isShowSideNav")
    v-content
      v-container
        nuxt
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import TheAppBar from '@/components/TheAppBar.vue'
import TheSideNav from '@/components/TheSideNav.vue'

@Component({
  components: {
    TheAppBar,
    TheSideNav
  }
})
export default class defaultLayout extends Vue {
  isShowSideNav: boolean | null = null

  toggleSideNav(): void {
    this.isShowSideNav = !this.isShowSideNav
  }
}
</script>
