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
import TheToolBar from '@/components/TheToolBar.vue'
import TheSideNav from '@/components/TheSideNav.vue'

@Component({
  components: {
    TheToolBar,
    TheSideNav
  }
})
export default class defaultLayout extends Vue {
  isShowSideNav: boolean | null = null

  toggleSideNav() {
    this.isShowSideNav = !this.isShowSideNav
  }
}
</script>
