<template lang="pug">
  v-container.pa-0.my-2
    todo-list-item-edit(
      v-if="isEditting"
      :todo="newTodo"
      :submitFn="updateContent"
      @endEdit="onEndEdit"
    )
    v-row.pl-8.cursor-copy(
      v-else
      @click="$emit('startEdit')"
    )
      v-icon.grey--text.ml-n6 add
      v-col.py-0
        div.grey--text 新しいTODOを追加
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { todosStore, authStore } from '@/store'
import { Todo } from '@/models/todo'
import TodoListItemEdit from '@/components/TodoListItemEdit.vue'

@Component({
  components: {
    TodoListItemEdit
  }
})
export default class TodoListItemNew extends Vue {
  @Prop() readonly projectId: string

  @Prop({ default: false }) readonly isEditting: ConstrainBoolean

  newTodo = new Todo({
    uid: authStore.currentUserUid,
    projectId: this.projectId
  })

  updateContent(todo: Todo): void {
    todo.priority = todosStore.maxPriority + 1
    todosStore.addTodo(todo)
    this.newTodo = new Todo({
      uid: authStore.currentUserUid,
      projectId: this.projectId
    })
  }

  onEndEdit(): void {
    this.$emit('endEdit')
  }
}
</script>
