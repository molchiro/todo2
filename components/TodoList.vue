<template lang="pug">
  v-card.pa-2
    todo-list-item-new(
      :isEditting="edittingTodoId === 'new'"
      :projectId="projectId"
      @click.native.capture="setEdittingTodoId('new')"
      @endEdit="setEdittingTodoId('')"
    )
    draggable(
      :list="todos"
      :delay="50"
      @end="draggableEnd($event)"
    )
      div(
        v-for="todo in todos"
        :key="todo.id"
      )
        todo-list-item-show(
          :todo="todo"
          :isEditting="todo.id === edittingTodoId"
          @startEdit="setEdittingTodoId(todo.id)"
          @endEdit="setEdittingTodoId('')"
        )
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import draggable from 'vuedraggable'
import { todosStore } from '@/store'
import { Todo } from '@/models/todo'
import TodoListItemShow from '@/components/TodoListItemShow.vue'
import TodoListItemNew from '@/components/TodoListItemNew.vue'

@Component({
  components: {
    TodoListItemShow,
    TodoListItemNew,
    draggable
  }
})
export default class TodoList extends Vue {
  @Prop() readonly projectId: string

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
