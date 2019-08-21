<template lang="pug">
  v-card
    v-container.py-0
      v-text-field(
        v-model="content"
        @click:append="add"
        @keypress.enter="add"
        append-icon="create"
      )
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import TodosModule from '@/store/modules/todos'
import AuthModule from '@/store/modules/auth'

@Component
export default class TodoPost extends Vue {
  todosModule = getModule(TodosModule, this.$store)

  authModule = getModule(AuthModule, this.$store)

  content: string = ''

  add(): void {
    if (this.content) {
      this.todosModule.add({
        uid: this.authModule.authedUserUid,
        content: this.content,
        priority: this.todosModule.maxPriority + 1,
        done: false,
        doneAt: null
      })
      this.content = ''
    }
  }
}
</script>
