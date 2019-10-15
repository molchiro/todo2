<template lang="pug">
  v-container.px-0.grey.lighten-3
    v-row(no-gutters)
      v-col(cols=1)
      v-col
        v-row
          v-text-field.white(
            v-model="localTodo.content"
            @keypress.enter="submit()"
            outlined
            hide-details
            autofocus
          )
        v-row
          v-btn.mt-2(
            @click="submit()"
            :disabled="!canUpdate"
            color="primary"
          ) 保存
          v-btn.mt-2.ml-2(
            @click="$emit('endEdit')"
            text
          ) キャンセル
      v-col(cols=1)
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

  submit(): void {
    if (this.canUpdate) {
      this.submitFn(this.localTodo)
      this.$emit('endEdit')
    }
  }
}
</script>
