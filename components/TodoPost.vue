<template lang="pug">
  v-card
    v-container.px-2.py-0
      v-row(no-gutters)
        v-col(offset=1)
          v-text-field(
            v-model="todo.content"
            @keypress.enter="add"
          )
        v-col.text-center.align-self-center(cols=1)
          v-icon(
            @click="add"
            :color="todo.isValid() ? 'primary' : 'grey'"
          ) create
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import TodosModule from '@/store/modules/todos'
import AuthModule from '@/store/modules/auth'
import { Todo } from '@/models/todo'

@Component
export default class TodoPost extends Vue {
  todosModule = getModule(TodosModule, this.$store)

  authModule = getModule(AuthModule, this.$store)

  todo = new Todo({ uid: this.authModule.currentUserUid })

  @Watch('todosModule.maxPriority')
  onMaxPriorityChanged(newVal: number) {
    this.todo.priority = newVal + 1
  }

  add(): void {
    if (this.todo.isValid()) {
      this.todosModule.addTodo(this.todo)
      this.todo = new Todo({ uid: this.authModule.currentUserUid })
    }
  }
}
</script>
