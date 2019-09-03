<template lang="pug">
  v-navigation-drawer(
    :value="value"
    @input="$emit('input', $event)"
    app
  )
    v-list
      v-list-item(@click="signOut")
        v-list-item-content
          v-list-item-title SIGNOUT
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import AuthModule from '@/store/modules/auth'

@Component
export default class TheSideNav extends Vue {
  authModule = getModule(AuthModule, this.$store)

  @Prop() readonly value: boolean | null = null

  signOut(): void {
    this.authModule.signOut()
    this.$router.push('sign_in')
  }
}
</script>
