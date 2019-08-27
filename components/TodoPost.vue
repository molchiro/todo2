<template lang="pug">
  v-card
    v-container.py-0
      v-text-field(
        v-model="todo.content"
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
import { Todo } from '@/models/todo'

@Component
export default class TodoPost extends Vue {
  todosModule = getModule(TodosModule, this.$store)

  authModule = getModule(AuthModule, this.$store)

  todo = new Todo({})

  add(): void {
    if (this.todo.content) {
      this.todo.uid = this.authModule.currentUserUid
      this.todo.priority = this.todosModule.maxPriority + 1
      this.todosModule.addTodo(this.todo)
      this.todo = new Todo({})
    }
  }
}
</script>
