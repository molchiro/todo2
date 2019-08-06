<template lang="pug">
  v-card
    v-container
      draggable(
        :list="todos"
        @end="draggableEnd"
        :delay="50"
      )
        v-flex(
          v-for="todo in todos"
          :key="todo.id"
        )
          todo-item(:todo="todo")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import TodosModule from '@/store/modules/todos'
import { todo } from '@/types/index'

@Component({
  components: {
    TodoItem: () => import('@/components/TodoItem.vue'),
    draggable: () => import('vuedraggable')
  }
})
export default class TodoList extends Vue {
  todosModule = getModule(TodosModule, this.$store)


  get todos(): todo[] {
    return this.todosModule.getTodos
  }

  created(): void {
    this.todosModule.bind()
  }

  draggableEnd(e): void {
    this.todosModule.updatePriority(e)
  }
}
</script>
