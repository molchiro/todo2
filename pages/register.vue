<template lang="pug">
  v-container.fill-height.justify-center
    v-form
      v-text-field(
        v-model="userName"
        :rules="[v => !!v || 'ユーザー名は必須です']"
        label="ユーザー名"
      )
      v-btn(@click="register()") REGISTER
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { currentUserStore } from '@/store'
import { User } from '@/models/user'

@Component({
  layout: 'titleOnly'
})
export default class registerPage extends Vue {
  userName: string = ''

  async register(): Promise<void> {
    await currentUserStore.register(new User({ displayName: this.userName }))
    if (this.$route.query.fromPath) {
      const fromPath = this.$route.query.fromPath as string
      this.$router.push(fromPath.replace('%2F', '/'))
    } else {
      this.$router.push('/')
    }
  }
}
</script>
