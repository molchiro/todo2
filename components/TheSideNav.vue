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
import ProjectModule from '@/store/modules/projects'

@Component
export default class TheSideNav extends Vue {
  authModule = getModule(AuthModule, this.$store)

  projectsModule = getModule(ProjectModule, this.$store)

  @Prop() readonly value: boolean | null = null

  created(): void {
    this.projectsModule.bindProjects(this.authModule.currentUserUid)
  }

  signOut(): void {
    this.authModule.signOut()
    this.$router.push('sign_in')
  }
}
</script>
