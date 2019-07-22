<template lang="pug">
  v-layout(column justify-center align-center)
    v-flex(xs12 sm8 md6)
      v-btn(@click="signIn") signIn
      v-btn(@click="getUser") getUser
      div {{ authedUserUid }}
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import AuthModule from '@/store/modules/auth'

@Component
export default class indexPage extends Vue {
  authModule = getModule(AuthModule, this.$store)

  get authedUserUid(): string {
    return this.authModule.authedUserUid
  }

  signIn(): void {
    this.authModule.signIn()
  }

  getUser(): void {
    this.authModule.getCurrentUser()
  }
}
</script>
