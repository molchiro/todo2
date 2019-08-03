<template lang="pug">
  v-card
    v-container.py-0.my-2
      v-text-field(
        v-model="content"
        append-icon="create"
        @click:append="add"
        @keypress.enter="add"
      )
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import TodosModule from '@/store/modules/todos'

@Component
export default class TodoPost extends Vue {
  todosModule = getModule(TodosModule, this.$store)

  content: string = ''

  add(): void {
    if (this.content) {
      this.todosModule.add(this.content)
      this.content = ''
    }
  }
}
</script>
