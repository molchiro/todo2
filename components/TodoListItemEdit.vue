<template lang="pug">
  v-container.pa-0
    v-row.pl-8
      v-icon.ml-n6.cursor-move(v-show="!isNew") drag_handle
      v-text-field.px-2.white(
        v-model="localTodo.content"
        @keypress.enter="submit()"
        outlined
        hide-details
        autofocus
      )
    v-row.pl-8
      v-btn.mt-2.ml-2(
        @click="submit()"
        :disabled="!canUpdate"
        color="primary"
      ) 保存
      v-btn.mt-2.ml-2(
        @click="$emit('endEdit')"
        text
      ) キャンセル
      v-spacer
      v-btn.mt-2(
        v-show="!isNew"
        @click="$emit('showDeleteDialog')"
        text
      ) 削除
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { Todo } from '@/models/todo'

@Component
export default class TodoListItemEdit extends Vue {
  @Prop() readonly todo: Todo

  @Prop() readonly submitFn: (todo) => void

  localTodo: Todo = new Todo({ ...this.todo })

  get canUpdate(): boolean {
    const isChanged = this.localTodo.content !== this.todo.content
    return isChanged && this.localTodo.isValid()
  }

  get isNew(): boolean {
    return this.todo.id === ''
  }

  submit(): void {
    if (this.canUpdate) {
      this.submitFn(this.localTodo)
      this.$emit('endEdit')
    }
  }
}
</script>
