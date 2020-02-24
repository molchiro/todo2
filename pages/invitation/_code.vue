<template lang="pug">
  v-container
    div プロジェクト名 {{ project.title }}
    v-btn(@click="joinProject()") 参加する
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { functions } from '@/plugins/firebase'
import { Project } from '@/models/project'

@Component({})
export default class invitationPage extends Vue {
  async asyncData({ route }) {
    const getProjectByInvitationCode = functions.httpsCallable(
      'getProjectByInvitationCode'
    )
    const project = await getProjectByInvitationCode(route.params.code)
    console.log(project.data)
    // @ts-ignore
    return { project: new Project({ ...project.data }) }
  }

  get invitationCode(): string {
    return this.$route.params.code
  }

  joinProject(): void {
    console.log(this.$route.params.code)
    const joinProject = functions.httpsCallable('joinProject')
    joinProject(this.$route.params.code)
  }
}
</script>
