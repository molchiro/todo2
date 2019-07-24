<template lang="pug">
  v-layout
    v-list
      v-list-tile(
        v-for="todo in todos"
        :key="todo.key"
      )
        v-list-tile-content {{ todo.content }}
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import TodosModule from '@/store/modules/todos'

@Component
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
