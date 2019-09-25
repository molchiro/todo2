<template lang="pug">
  v-navigation-drawer(
    :value="value"
    @input="$emit('input', $event)"
    app
  )
    v-list
      v-subheader PROJECTS
      project-list
      v-divider
      v-subheader OTHERS

      v-list-item(@click="signOut")
        v-row(dense)
          v-col(cols=1)
          v-col.pl-3
            v-list-item-content
              v-list-item-title SIGNOUT
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'
import AuthModule from '@/store/modules/auth'
import ProjectList from '@/components/ProjectList.vue'

@Component({
  components: {
    ProjectList
  }
})
export default class TheSideNav extends Vue {
  authModule = getModule(AuthModule, this.$store)

  @Prop() readonly value: boolean | null = null

  signOut(): void {
    this.authModule.signOut()
    this.$router.push('sign_in')
  }
}
</script>
