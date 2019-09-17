<template lang="pug">
  v-card.pa-2
    draggable(
      :list="todos"
      :delay="50"
      @end="draggableEnd"
    )
      div(
        v-for="todo in todos"
        :key="todo.id"
      )
        todo-list-item-edit(
          v-if="todo.id === edittingTodoId"
          :todo="todo"
          @endEdit="setEdittingTodoId('')"
        )
        todo-list-item-show(
          v-else
          :todo="todo"
          @click.native.capture="setEdittingTodoId('')"
          @startEdit="setEdittingTodoId(todo.id)"
        )
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import draggable from 'vuedraggable'
import TodosModule from '@/store/modules/todos'
import AuthModule from '@/store/modules/auth'
import { Todo } from '@/models/todo'
import TodoListItemEdit from '@/components/TodoListItemEdit.vue'
import TodoListItemShow from '@/components/TodoListItemShow.vue'

@Component({
  components: {
    TodoListItemEdit,
    TodoListItemShow,
    draggable
  }
})
export default class TodoList extends Vue {
  todosModule = getModule(TodosModule, this.$store)

  authModule = getModule(AuthModule, this.$store)

  edittingTodoId: string = ''

  get todos(): Todo[] {
    return this.todosModule.getTodos
  }

  draggableEnd(e): void {
    if (this.todos[e.oldIndex].done) return
    this.todosModule.moveTodo({
      oldIndex: e.oldIndex,
      newIndex: e.newIndex
    })
  }

  setEdittingTodoId(id: string): void {
    this.edittingTodoId = id
  }
}
</script>
