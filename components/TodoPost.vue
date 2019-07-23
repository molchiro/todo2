<template lang="pug">
  v-layout
    v-text-field(
      v-model="content"
      append-icon="create"
      @click:append="add"
    )
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import TodosModule from '@/store/modules/todos'

@Component
export default class TodoPost extends Vue {
  authModule = getModule(TodosModule, this.$store)

  content: string = ''

  add(): void {
    if (this.content) {
      this.authModule.add(this.content)
      this.content = ''
    }
  }
}
</script>
