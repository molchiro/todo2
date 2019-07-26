<template lang="pug">
  v-layout(row)
    v-checkbox(v-model="done")
    v-flex {{ todo.content }}
    v-icon(
      @click="deleteMe"
    ) delete
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import TodosModule from '@/store/modules/todos'

@Component
export default class TodoItem extends Vue {
  todosModule = getModule(TodosModule, this.$store)

  @Prop() todo

  get done() {
    return this.todo.done
  }

  set done(val) {
    this.todosModule.done({ id: this.todo.id, done: val })
  }

  deleteMe() {
    this.todosModule.delete(this.todo.id)
  }
}
</script>
