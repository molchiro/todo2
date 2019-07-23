<template lang="pug">
  v-layout(column justify-center align-center)
    v-flex(xs12 sm8 md6)
      v-btn(@click="signIn") SIGNIN
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import AuthModule from '@/store/modules/auth'

@Component
export default class indexPage extends Vue {
  authModule = getModule(AuthModule, this.$store)

  signIn(): void {
    this.authModule.signIn()
  }
}
</script>
