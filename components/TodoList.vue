<template lang="pug">
  v-layout
    v-list
      v-list-tile(
        v-for="todo in todos"
        :key="todo.id"
      )
        todo-item(
          :todo="todo"
        )
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import TodosModule from '@/store/modules/todos'

@Component({
  components: {
    TodoItem: () => import('@/components/TodoItem.vue')
  }
})
export default class TodoPost extends Vue {
  todosModule = getModule(TodosModule, this.$store)

  content: string = ''

  get todos() {
    return this.todosModule.todos
  }

  created(): void {
    this.todosModule.bind()
  }
}
</script>
