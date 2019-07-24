<template lang="pug">
  v-flex
    v-list-tile-content {{ todo.content }}
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

  deleteMe() {
    this.todosModule.delete(this.todo.id)
  }
}
</script>
