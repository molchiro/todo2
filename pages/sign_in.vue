<template lang="pug">
  v-container.fill-height.justify-center
    v-btn(@click="signIn()") SIGNIN
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'
import AuthModule from '@/store/modules/auth'

@Component({
  layout: 'titleOnly'
})
export default class signInPage extends Vue {
  authModule = getModule(AuthModule, this.$store)

  signIn(): void {
    this.authModule.signIn()
  }
}
</script>
