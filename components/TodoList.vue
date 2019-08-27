<template lang="pug">
  v-card
    v-container
      draggable(
        :list="todos"
        :delay="50"
        @end="draggableEnd"
      )
        v-flex(
          v-for="todo in todos"
          :key="todo.id"
        )
          todo-item-edit(
            v-if="todo.id === selectedTodoId"
            :todo="todo"
            @endEdit="clearSelectedTodoId"
          )
          todo-item-show(
            v-else
            :todo="todo"
            @click.native.capture="clearSelectedTodoId"
            @startEdit="setSelectedTodoId(todo.id)"
          )
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import draggable from 'vuedraggable'
import TodosModule from '@/store/modules/todos'
import AuthModule from '@/store/modules/auth'
import { Todo } from '@/models/todo'
import TodoItemEdit from '@/components/TodoItemEdit.vue'
import TodoItemShow from '@/components/TodoItemShow.vue'

@Component({
  components: {
    TodoItemEdit,
    TodoItemShow,
    draggable
  }
})
export default class TodoList extends Vue {
  todosModule = getModule(TodosModule, this.$store)

  authModule = getModule(AuthModule, this.$store)

  selectedTodoId: string = ''

  get todos(): Todo[] {
    return this.todosModule.getTodos
  }

  created(): void {
    this.todosModule.bindTodos(this.authModule.currentUserUid)
  }

  draggableEnd(e): void {
    if (this.todos[e.oldIndex].done) return
    this.todosModule.moveTodo({
      oldIndex: e.oldIndex,
      newIndex: e.newIndex
    })
  }

  setSelectedTodoId(id: string): void {
    this.selectedTodoId = id
  }

  clearSelectedTodoId(): void {
    this.selectedTodoId = ''
  }
}
</script>
