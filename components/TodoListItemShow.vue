<template lang="pug">
  v-container.pa-0.my-3
    v-row.pl-8.cursor-copy(
      v-if="isNew"
      @click="$emit('startEdit')"
    )
      v-icon.grey--text.ml-n6 add
      v-col.py-0
        div.grey--text 新しいTODOを追加
    v-row.pl-8(v-else)
      v-checkbox.justify-center.ma-0.ml-n6.pa-0(
          v-model="done"
          hide-details
        )
      v-col.py-0.pl-1.cursor-text
        div(@click="$emit('startEdit')") {{ todo.content }}
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { todosStore } from '@/store'
import { Todo } from '@/models/todo'
import { serverTimeStamp } from '@/plugins/firebase'
import TodoListItemEdit from '@/components/TodoListItemEdit.vue'

@Component({
  components: {
    TodoListItemEdit
  }
})
export default class TodoListItemShow extends Vue {
  @Prop() readonly todo: Todo

  @Prop({ default: false }) readonly isNew: boolean

  localTodo: Todo = new Todo({ ...this.todo })

  get done(): boolean {
    return this.todo.done
  }

  set done(val: boolean) {
    todosStore.updateTodo(
      new Todo({
        ...this.todo,
        done: val,
        doneAt: val ? serverTimeStamp : null
      })
    )
  }

  startEdit(): void {
    this.$emit('startEdit')
  }
}
</script>
