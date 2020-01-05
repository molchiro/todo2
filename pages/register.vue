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

  register(): void {
    currentUserStore.register(new User({ displayName: this.userName }))
  }
}
</script>
