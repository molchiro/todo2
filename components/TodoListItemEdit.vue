<template lang="pug">
  v-container.px-0.grey.lighten-3
    delete-dialog(
      v-model="isShowDeleteDialog"
      @delete="deleteTodo()"
    ) この操作は取り消せません
    v-row(no-gutters)
      v-col(offset=1)
        v-text-field.white(
          v-model="localTodo.content"
          @keypress.enter="updateContent()"
          outlined
          hide-details
        )
      v-col(cols=1)
        v-row(no-gutters)
          v-col.text-center
            v-icon(
              :color="canUpdate ? 'primary' : 'grey lighten-1'"
              @click="updateContent()"
            ) edit
        v-row(no-gutters)
          v-col.text-center.pt-2
            v-icon(@click="showDeleteDialog()") delete
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'
import TodosModule from '@/store/modules/todos'
import DeleteDialog from '@/components/DeleteDialog.vue'
import { Todo } from '@/models/todo'

@Component({
  components: {
    DeleteDialog
  }
})
export default class TodoItemEdit extends Vue {
  todosModule = getModule(TodosModule, this.$store)

  isShowDeleteDialog: boolean = false

  @Prop() readonly todo: Todo

  localTodo: Todo = new Todo({ ...this.todo })

  get canUpdate(): boolean {
    const isChanged = this.localTodo.content !== this.todo.content
    return isChanged && this.localTodo.isValid()
  }

  updateContent(): void {
    if (this.canUpdate) {
      this.todosModule.updateTodo(this.localTodo)
      this.$emit('endEdit')
    }
  }

  showDeleteDialog(): void {
    this.isShowDeleteDialog = true
  }

  deleteTodo(): void {
    this.todosModule.deleteTodo(this.localTodo)
    this.isShowDeleteDialog = false
  }
}
</script>
