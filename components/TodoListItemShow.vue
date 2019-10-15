<template lang="pug">
  v-container.pa-0.my-2(
    @mouseover="isMouseOvered=true"
    @mouseleave="isMouseOvered=false"
  )
    delete-dialog(
      v-model="isShowDeleteDialog"
      @delete="deleteTodo()"
    ) この操作は取り消せません
    div(v-if="isEditting")
      todo-list-item-edit(
        :todo="localTodo"
        :submitFn="updateContent"
        @endEdit="$emit('endEdit')"
      )
    div(v-else)
      v-row(no-gutters)
        v-col(cols=1)
          v-checkbox.justify-center.mt-0.pt-0(
            v-model="done"
            hide-details
          )
        v-col(cols=10)
          div(@click="$emit('startEdit')") {{ todo.content }}
        v-col.text-center(cols=1)
          v-icon(
            v-show="isMouseOvered"
            @click="showDeleteDialog()"
          ) delete
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { todosStore } from '@/store'
import { Todo } from '@/models/todo'
import { serverTimeStamp } from '@/plugins/firebase'
import DeleteDialog from '@/components/DeleteDialog.vue'
import TodoListItemEdit from '@/components/TodoListItemEdit.vue'

@Component({
  components: {
    DeleteDialog,
    TodoListItemEdit
  }
})
export default class TodoListItemShow extends Vue {
  @Prop() readonly todo: Todo

  @Prop({ default: false }) readonly isEditting: ConstrainBoolean

  isShowDeleteDialog: boolean = false

  isMouseOvered: boolean = false

  localTodo: Todo = new Todo({ ...this.todo })

  get done(): boolean {
    return this.todo.done
  }

  set done(val) {
    todosStore.updateTodo(
      new Todo({
        ...this.todo,
        done: val,
        doneAt: val ? serverTimeStamp : null
      })
    )
  }

  showDeleteDialog(): void {
    this.isShowDeleteDialog = true
  }

  deleteTodo(): void {
    todosStore.deleteTodo(this.localTodo)
    this.isShowDeleteDialog = false
  }

  updateContent(todo): void {
    todosStore.updateTodo(todo)
  }

  startEdit(): void {
    this.$emit('startEdit')
  }
}
</script>
