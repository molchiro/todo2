<template lang="pug">
  v-container.pa-0.my-2
    div(v-if="isEditting")
      todo-list-item-edit(
        :todo="newTodo"
        :submitFn="updateContent"
        @endEdit="$emit('endEdit')"
      )
    div(v-else)
      v-row(no-gutters)
        v-col(cols=1)
          v-btn(
            text
            icon
            x-small
          )
            v-icon add
        v-col(cols=10)
          div.grey--text 新しいTODOを追加
        v-col(cols=1)
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
}
</script>
