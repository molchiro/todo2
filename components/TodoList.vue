<template lang="pug">
  v-card.px-3.py-1
    delete-dialog(
      v-model="isOpenedDeleteDialog"
      :onClickDelete="deleteTodo"
      :onClickCancel="releaseDeleteDialog"
    ) この操作は取り消せません
    component(
        :isNew="true"
        :is="newTodo.id === edittingTodoId ? 'todo-list-item-edit' : 'todo-list-item-show'"
        :todo="newTodo"
        :setEdittingTodoId="setEdittingTodoId"
        :onAddTodo="onAddTodo"
      )
    draggable(
      :list="todos"
      :delay="50"
      @end="draggableEnd($event)"
    )
      component(
        v-for="todo in todos"
        :key="todo.id"
        :is="todo.id === edittingTodoId ? 'todo-list-item-edit' : 'todo-list-item-show'"
        :todo="todo"
        :setEdittingTodoId="setEdittingTodoId"
        :onClickDelete="setDeleteTodoDialog"
      )
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import draggable from 'vuedraggable'
import { todosStore, authStore, projectsStore } from '@/store'
import { Todo } from '@/models/todo'
import TodoListItemShow from '@/components/TodoListItemShow.vue'
import TodoListItemEdit from '@/components/TodoListItemEdit.vue'
import DeleteDialog from '@/components/DeleteDialog.vue'

@Component({
  components: {
    TodoListItemShow,
    TodoListItemEdit,
    draggable,
    DeleteDialog
  }
})
export default class TodoList extends Vue {
  @Prop() readonly projectId: string

  isOpenedDeleteDialog: boolean = false

  todoToDelete: Todo | null = null

  edittingTodoId: string | null = null

  newTodo: Todo = new Todo({
    uid: authStore.currentUserUid,
    projectId: this.selectedProjectId
  })

  get todos(): Todo[] {
    return todosStore.getTodos
  }

  get selectedProjectId(): string {
    return projectsStore.selectedProjectId
  }

  draggableEnd({ oldIndex, newIndex }): void {
    if (!this.todos[oldIndex].done) {
      todosStore.moveTodo({ oldIndex, newIndex })
    }
  }

  setEdittingTodoId(id: string | null): void {
    this.edittingTodoId = id
  }

  setDeleteTodoDialog(todo: Todo): void {
    this.todoToDelete = todo
    this.isOpenedDeleteDialog = true
  }

  releaseDeleteDialog(): void {
    this.todoToDelete = null
    this.isOpenedDeleteDialog = false
  }

  deleteTodo(): void {
    todosStore.deleteTodo(this.todoToDelete!)
    this.releaseDeleteDialog()
  }

  onAddTodo(): void {
    this.newTodo = new Todo({
      uid: authStore.currentUserUid,
      projectId: this.selectedProjectId
    })
  }
}
</script>
