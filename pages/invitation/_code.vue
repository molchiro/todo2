<template lang="pug">
  v-container
    //- div プロジェクト名 {{ projectTitle }}
    v-btn(@click="joinProject()") 参加する
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { functions } from '@/plugins/firebase'

@Component({})
export default class invitationPage extends Vue {
  // async asyncData({ route }) {
  //   const getProjectNameByInvitationCode = functions.httpsCallable(
  //     'getProjectNameByInvitationCode'
  //   )
  //   const { data } = await getProjectNameByInvitationCode({
  //     code: route.params.code
  //   })
  //   return { projectTitle: data.title }
  // }

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
