<template lang="pug">
  v-container.fill-height.justify-center.text-center
    div
      div.pb-3
        b {{ project.title }}
        |  に招待されています。
      div(v-if="isAuthed")
        v-btn(@click="joinProject()") 参加する
      div(v-else)
        div.pb-3 参加するにはまずサインインを行ってください
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
    const joinProject = functions.httpsCallable('joinProject')
    joinProject(this.$route.params.code).then((result) => {
      this.$router.push(`/projects/${result.data.id}`)
    })
  }

  signIn(): void {
    authStore.signIn()
  }

  created(): void {
    // @ts-ignore
    const project = this.project
    if (
      !!project &&
      this.isAuthed &&
      project.members.includes(authStore.currentUser!!.uid)
    ) {
      this.$router.push(`/projects/${project.id}`)
    }
  }
}
</script>
