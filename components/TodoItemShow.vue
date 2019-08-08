<template lang="pug">
  v-layout.my-2(row)
    v-checkbox.mt-0.pt-0(
      v-model="done"
      hide-details
    )
    v-flex {{ todo.content }}
    v-icon(
      @click="startEdit"
    ) more_horiz
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import TodosModule from '@/store/modules/todos'
import { todo } from '@/types/index'

@Component
export default class TodoItemShow extends Vue {
  todosModule = getModule(TodosModule, this.$store)

  @Prop() todo: todo

  get done() {
    return this.todo.done
  }

  set done(val) {
    this.todosModule.updateDone({ id: this.todo.id, done: val })
  }

  startEdit() {
    this.$emit('startEdit')
  }
}
</script>
