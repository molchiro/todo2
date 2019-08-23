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
import { todo } from '@/types/index'
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

  selectedTodoId: string = ''

  get todos(): todo[] {
    return this.todosModule.todos.map((todo) => {
      return {
        id: todo.id,
        data: { ...todo.data }
      }
    })
  }

  created(): void {
    this.todosModule.bindTodos()
  }

  draggableEnd(e): void {
    if (this.todos[e.oldIndex].data.done) return
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
