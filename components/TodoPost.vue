<template lang="pug">
  v-card
    v-container.px-2.py-0
      v-row(no-gutters)
        v-col.pr-1(offset=1)
          v-text-field(
            v-model="todo.content"
            @keypress.enter="addTodo()"
          )
        v-col.text-center.align-self-center(cols=1)
          v-icon(
            @click="addTodo()"
            :color="todo.isValid() ? 'primary' : 'grey'"
          ) create
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator'
import { authStore, todosStore } from '@/store'
import { Todo } from '@/models/todo'

@Component
export default class TodoPost extends Vue {
  @Prop() readonly projectId: string

  todo = new Todo({
    uid: authStore.currentUserUid,
    projectId: this.projectId
  })

  @Watch('todosModule.maxPriority')
  onMaxPriorityChanged(newVal: number) {
    this.todo.priority = newVal + 1
  }

  addTodo(): void {
    if (this.todo.isValid()) {
      todosStore.addTodo(this.todo)
      this.todo = new Todo({
        uid: authStore.currentUserUid,
        projectId: this.projectId
      })
    }
  }
}
</script>
