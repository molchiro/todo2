<template lang="pug">
  v-container
    div
      b {{ project.title }}
      |  に招待されています。
    div(v-if="isAuthed")
      v-btn(@click="joinProject()") 参加する
    div(v-else)
      div 参加するにはまずサインインを行ってください
      v-container.fill-height.justify-center
        v-btn(@click="signIn()") SIGNIN

</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { authStore } from '@/store'
import { functions } from '@/plugins/firebase'
import { Project } from '@/models/project'

@Component({
  layout: 'titleOnly'
})
export default class invitationPage extends Vue {
  async asyncData({ route }) {
    const getProjectByInvitationCode = functions.httpsCallable(
      'getProjectByInvitationCode'
    )
    const project = await getProjectByInvitationCode(route.params.code)
    // @ts-ignore
    return { project: new Project({ ...project.data }) }
  }

  get invitationCode(): string {
    return this.$route.params.code
  }

  get isAuthed(): boolean {
    return !!authStore.currentUser
  }

  joinProject(): void {
    console.log(this.$route.params.code)
    const joinProject = functions.httpsCallable('joinProject')
    joinProject(this.$route.params.code)
  }

  signIn(): void {
    authStore.signIn()
  }
}
</script>
