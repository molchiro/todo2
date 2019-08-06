<template lang="pug">
  v-layout.my-2(column)
    v-layout(row)
      v-flex(xs-1)
        v-checkbox.mt-0.pt-0(
          v-model="done"
          hide-details
        )
      v-flex(grow)
        v-text-field(
          v-model="content"
          outline
          single-line
          hide-details
        )
    v-layout(row)
      v-flex(
        offset-xs1
        @click="updateContent"
      ) 更新
      v-flex(
        @click="cancelEdit"
      ) キャンセル
      v-spacer
      v-flex(
        xs-1
        @click="deleteMe"
      ) 削除
      v-spacer(xs-1)
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

  get done() {
    return this.todo.done
  }

  set done(val) {
    this.todosModule.updateDone({ id: this.todo.id, done: val })
  }

  created() {
    this.content = this.todo.content
  }

  updateContent() {
    this.todosModule.updateContent({ id: this.todo.id, content: this.content })
    this.$emit('endEdit')
  }

  cancelEdit() {
    this.$emit('endEdit')
  }

  deleteMe() {
    this.todosModule.delete(this.todo.id)
  }
}
</script>
