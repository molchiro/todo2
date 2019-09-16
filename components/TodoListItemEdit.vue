<template lang="pug">
  v-layout.py-2.grey.lighten-3
    v-dialog(
      v-model="isShowDeleteDialog"
      max-width=300
    )
      v-card
        v-card-title 削除しますか？
        v-divider
        v-card-actions
          v-row(no-gutters)
            v-col.pa-0
              v-btn(
                @click="isShowDeleteDialog = false"
                text
                block
              ) キャンセル
            v-divider(vertical)
            v-col.pa-0
              v-btn(
                @click="deleteTodo"
                text
                block
                color="red"
              ) 削除
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
            v-icon(@click="showDeleteDialog") delete
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import TodosModule from '@/store/modules/todos'
import { Todo } from '@/models/todo'

@Component
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
