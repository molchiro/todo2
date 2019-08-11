<template lang="pug">
  v-app
    the-tool-bar(@toggleSideNav="toggleSideNav")
    the-side-nav(v-model="isShowSideNav")
    v-content
      v-container
        nuxt
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {
    TheToolBar: () => import('@/components/TheToolBar.vue'),
    TheSideNav: () => import('@/components/TheSideNav.vue')
  }
})
export default class defaultLayout extends Vue {
  isShowSideNav: boolean | null = null

  toggleSideNav() {
    this.isShowSideNav = !this.isShowSideNav
  }
}
</script>
