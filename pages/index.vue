<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div>{{ message }}</div>
      <v-btn @click="incr">!</v-btn>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class indexPage extends Vue {
  message: string = 'hello world!!'

  incr(): void {
    this.message = this.message + '!'
  }
}
</script>
