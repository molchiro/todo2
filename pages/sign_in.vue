<template lang="pug">
  v-layout(
    column
    align-center
  )
    v-flex
      v-btn(@click="signIn") SIGNIN
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import AuthModule from '@/store/modules/auth'

@Component
export default class signInPage extends Vue {
  authModule = getModule(AuthModule, this.$store)

  signIn(): void {
    this.authModule.signIn()
  }
}
</script>
