<template lang="pug">
  v-layout
    v-flex
      v-btn(
        @click="signOut"
        block
      ) SIGNOUT
      todo-post
      todo-list
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import AuthModule from '@/store/modules/auth'

@Component({
  components: {
    TodoPost: () => import('@/components/TodoPost.vue'),
    TodoList: () => import('@/components/TodoList.vue')
  }
})
export default class indexPage extends Vue {
  authModule = getModule(AuthModule, this.$store)

  signOut(): void {
    this.authModule.signOut()
    this.$router.push('sign_in')
  }
}
</script>
