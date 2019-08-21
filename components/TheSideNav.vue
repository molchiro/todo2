<template lang="pug">
  v-navigation-drawer(
    :value="value"
    @input="$emit('input', $event)"
    fixed
    app
  )
    v-list
      v-list-tile(@click="signOut")
        v-list-tile-content
          v-list-tile-title SIGNOUT
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import AuthModule from '@/store/modules/auth'

@Component
export default class TheSideNav extends Vue {
  authModule = getModule(AuthModule, this.$store)

  @Prop() value: boolean | null = null

  signOut(): void {
    this.authModule.signOut()
    this.$router.push('sign_in')
  }
}
</script>
