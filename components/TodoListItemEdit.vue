<template lang="pug">
  v-container.pa-0
    v-row.pl-8
      v-icon.ml-n6.cursor-move(v-show="!isNew && !todo.done") drag_handle
      v-textarea.px-2.white(
        v-model="localTodo.content"
        @keypress.enter="save()"
        outlined
        hide-details
        autofocus
        auto-grow
        row-height="20"
        rows="2"
      )
    v-row.pl-8
      v-select.ma-3(
        label="担当者"
        v-model="localTodo.assignToUid"
        :items="members"
        hide-details
        item-text="name"
        item-value="uid"
      )
    v-row.pl-8
      v-btn.mt-2.ml-2(
        @click="save()"
        :disabled="!canUpdate"
        color="primary"
      ) 保存
      v-btn.mt-2.ml-2(
        @click="setEdittingTodoId(null)"
        text
      ) キャンセル
      v-spacer
      v-btn.mt-2(
        v-show="!isNew"
        @click="onClickDelete(localTodo)"
        text
      ) 削除
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { Todo } from '@/models/todo'
import { todosStore } from '@/store'

@Component
export default class TodoListItemEdit extends Vue {
  @Prop() readonly todo: Todo

  @Prop({ default: false }) readonly isNew: boolean

  @Prop({ default: () => {} }) readonly onAddTodo: Function

  @Prop({ default: () => {} }) readonly setEdittingTodoId: Function

  @Prop({ default: () => {} }) readonly onClickDelete: Function

  @Prop() readonly members: Array<{ uid: string; name: string }>

  localTodo: Todo = new Todo({ ...this.todo })

  get canUpdate(): boolean {
    const isContentChanged = this.localTodo.content !== this.todo.content
    const isAssignToUidChanged =
      this.localTodo.assignToUid !== this.todo.assignToUid
    const isChanged = isContentChanged || isAssignToUidChanged
    return isChanged && this.localTodo.isValid()
  }

  save(): void {
    if (this.canUpdate) {
      if (this.isNew) {
        todosStore.addTodo(this.localTodo)
        this.onAddTodo()
      } else {
        todosStore.updateTodo(this.localTodo)
      }
      this.setEdittingTodoId(null)
    }
  }
}
</script>
