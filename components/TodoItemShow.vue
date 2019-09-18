<template lang="pug">
  v-container.pa-0.my-2
    v-row(no-gutters)
      v-col(cols=1)
        v-checkbox.justify-center.mt-0.pt-0(
          v-model="done"
          hide-details
        )
      v-col(cols=10)
        div {{ todo.content }}
      v-col.text-center(cols=1)
        v-icon(@click="startEdit") more_horiz
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'
import TodosModule from '@/store/modules/todos'
import { Todo } from '@/models/todo'
import { serverTimeStamp } from '@/plugins/firebase'

@Component
export default class TodoItemShow extends Vue {
  todosModule = getModule(TodosModule, this.$store)

  @Prop() readonly todo: Todo

  get done(): boolean {
    return this.todo.done
  }

  set done(val) {
    this.todosModule.updateTodo(
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
