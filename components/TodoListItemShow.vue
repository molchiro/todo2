<template lang="pug">
  v-container.pa-0.my-3
    todo-list-item-edit(
      v-if="isEditting"
      :todo="localTodo"
      :submitFn="updateContent"
      @endEdit="$emit('endEdit')"
      @showDeleteDialog="$emit('showDeleteDialog')"
    )
    v-row.pl-8(
      v-else
    )
      v-checkbox.justify-center.ma-0.ml-n6.pa-0(
          v-model="done"
          hide-details
        )
      v-col.py-0.pl-1
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

  @Prop({ default: false }) readonly isEditting: ConstrainBoolean

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

  updateContent(todo): void {
    todosStore.updateTodo(todo)
  }

  startEdit(): void {
    this.$emit('startEdit')
  }
}
</script>

<style lang="sass" scoped>
.mouseovered-icon
  width: 24px
  height: 24px
</style>
