<template lang="pug">
  v-container.fill-height.justify-center
    v-btn(@click="signIn()") SIGNIN
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { authStore } from '@/store'

@Component({
  layout: 'titleOnly'
})
export default class signInPage extends Vue {
  signIn(): void {
    authStore.signIn()
  }
}
</script>
