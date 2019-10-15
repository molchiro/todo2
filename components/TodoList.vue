<template lang="pug">
  v-card.px-3.py-1
    delete-dialog(
      v-model="isShowDeleteDialog"
      @delete="deleteTodo()"
    ) この操作は取り消せません
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
        v-divider
        todo-list-item-show(
          :todo="todo"
          :isEditting="todo.id === edittingTodoId"
          @startEdit="setEdittingTodoId(todo.id)"
          @endEdit="setEdittingTodoId('')"
          @showDeleteDialog="showDeleteDialog(todo)"
        )
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import draggable from 'vuedraggable'
import { todosStore } from '@/store'
import { Todo } from '@/models/todo'
import TodoListItemShow from '@/components/TodoListItemShow.vue'
import TodoListItemNew from '@/components/TodoListItemNew.vue'
import DeleteDialog from '@/components/DeleteDialog.vue'

@Component({
  components: {
    TodoListItemShow,
    TodoListItemNew,
    draggable,
    DeleteDialog
  }
})
export default class TodoList extends Vue {
  @Prop() readonly projectId: string

  isShowDeleteDialog: boolean = false

  todoToDelete: Todo | null = null

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

  showDeleteDialog(todo: Todo): void {
    this.todoToDelete = todo
    this.isShowDeleteDialog = true
  }

  deleteTodo(): void {
    if (this.todoToDelete) {
      todosStore.deleteTodo(this.todoToDelete)
    }
    this.isShowDeleteDialog = false
  }
}
</script>
