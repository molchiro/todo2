<template lang="pug">
  v-card.pa-2
    draggable(
      :list="todos"
      :delay="50"
      @end="draggableEnd($event)"
    )
      div(
        v-for="todo in todos"
        :key="todo.id"
      )
        todo-list-item-edit(
          v-if="todo.id === edittingTodoId"
          :todo="todo"
          @endEdit="setEdittingTodoId('')"
        )
        todo-list-item-show(
          v-else
          :todo="todo"
          @click.native.capture="setEdittingTodoId('')"
          @startEdit="setEdittingTodoId(todo.id)"
        )
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import draggable from 'vuedraggable'
import { todosStore } from '@/store'
import { Todo } from '@/models/todo'
import TodoListItemEdit from '@/components/TodoListItemEdit.vue'
import TodoListItemShow from '@/components/TodoListItemShow.vue'

@Component({
  components: {
    TodoListItemEdit,
    TodoListItemShow,
    draggable
  }
})
export default class TodoList extends Vue {
  edittingTodoId: string = ''

  get todos(): Todo[] {
    return todosStore.getTodos
  }

  draggableEnd({ oldIndex, newIndex }): void {
    if (!this.todos[oldIndex].done) {
      todosStore.moveTodo({ oldIndex, newIndex })
    }
  }

  setEdittingTodoId(id: string): void {
    this.edittingTodoId = id
  }
}
</script>
