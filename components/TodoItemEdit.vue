<template lang="pug">
  v-layout.py-2.grey.lighten-3
    v-dialog(v-model="isShowDeleteDialog")
      v-card
        v-card-text 削除しますか？
        v-divider
        v-card-actions
          v-spacer
          v-btn(
            @click="isShowDeleteDialog = false"
            flat
          ) いいえ
          v-divider(vertical)
          v-btn(
            @click="deleteTodo"
            flat
          ) はい
    v-flex.mr-1(
      offset-xs1
    )
      v-text-field.white(
        v-model="content"
        outline
        single-line
        hide-details
      )
    v-flex(xs1)
      v-layout(
        wrap
        column
      )
        v-flex
          v-layout(justify-center)
            v-icon(
              :color="canUpdate ? 'primary' : 'grey lighten-1'"
              @click="updateContent"
            ) edit
        v-flex.pt-2
          v-layout(justify-center)
            v-icon(@click="showDeleteDialog") delete
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

  isShowDeleteDialog: boolean = false

  @Prop() todo: todo

  get canUpdate(): boolean {
    return this.content !== this.todo.data.content && !!this.content
  }

  created(): void {
    this.content = this.todo.data.content
  }

  updateContent(): void {
    if (this.canUpdate) {
      this.todosModule.updateTodo({
        id: this.todo.id,
        data: {
          ...this.todo.data,
          content: this.content
        }
      })
      this.$emit('endEdit')
    }
  }

  showDeleteDialog(): void {
    this.isShowDeleteDialog = true
  }

  deleteTodo(): void {
    this.todosModule.deleteTodo(this.todo.id)
    this.isShowDeleteDialog = false
  }
}
</script>
