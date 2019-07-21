<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div>{{ testHoge }}</div>
      <v-btn @click="incr">!</v-btn>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import TestModule from '@/store/modules/test'

@Component
export default class indexPage extends Vue {
  testModule = getModule(TestModule, this.$store)

  get testHoge() {
    return this.testModule.hoge
  }

  incr(): void {
    this.testModule.incr()
  }
}
</script>
