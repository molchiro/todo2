<template lang="pug">
  v-layout.py-2.grey.lighten-3
    v-flex(
      offset-xs1
    )
      v-text-field.white(
        v-model="content"
        outline
        single-line
        hide-details
      )
    v-flex(xs1)
      v-layout(wrap)
        v-flex
          v-icon(
            @click="updateContent"
          ) edit
        v-flex
          v-icon(
            @click="deleteMe"
          ) delete
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import TodosModule from '@/store/modules/todos'
import { todo } from '@/types/index'

@Component
export default class TodoItemEdit extends Vue {
  todosModule = getModule(TodosModule, this.$store)

  content: string = ''

  @Prop() todo: todo

  created() {
    this.content = this.todo.content
  }

  updateContent() {
    if (this.content) {
      this.todosModule.updateContent({
        id: this.todo.id,
        content: this.content
      })
    }
    this.$emit('endEdit')
  }

  deleteMe() {
    this.todosModule.delete(this.todo.id)
  }
}
</script>
