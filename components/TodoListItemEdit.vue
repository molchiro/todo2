<template lang="pug">
  v-container.px-0.grey.lighten-3
    v-row(no-gutters)
      v-col(offset=1)
        v-text-field.white(
          v-model="localTodo.content"
          @keypress.enter="submit()"
          outlined
          hide-details
        )
      v-col(cols=1)
        v-row(no-gutters)
          v-col.text-center
            v-btn(
              :color="canUpdate ? 'primary' : 'grey lighten-1'"
              @click="submit()"
            ) 保存
        v-row(no-gutters)
          v-col.text-center.pt-2
            v-btn(@click="$emit('endEdit')") キャンセル
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
