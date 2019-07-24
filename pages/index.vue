<template lang="pug">
  v-layout(column justify-center align-center)
    v-flex(xs12 sm8 md6)
      v-btn(@click="signOut") SIGNOUT
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

  get authedUserUid(): string {
    return this.authModule.authedUserUid
  }

  signOut(): void {
    this.authModule.signOut()
    this.$router.push('sign_in')
  }
}
</script>
