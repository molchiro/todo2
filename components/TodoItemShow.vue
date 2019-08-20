<template lang="pug">
  v-layout.my-2(row)
    v-flex(xs1)
      v-layout(
        align-center
        justify-center
        fill-height
      )
        div
          v-checkbox.mt-0.pt-0(
            v-model="done"
            hide-details
          )
    v-flex(xs10)
      v-layout(justify-center)
        div {{ todo.data.content }}
    v-flex(xs1)
      v-layout(
        align-center
        justify-center
        fill-height
      )
        v-icon(
          @click="startEdit"
        ) more_horiz
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import TodosModule from '@/store/modules/todos'
import { todo } from '@/types/index'
import { serverTimeStamp } from '@/plugins/firebase'

@Component
export default class TodoItemShow extends Vue {
  todosModule = getModule(TodosModule, this.$store)

  @Prop() todo: todo

  get done(): boolean {
    return this.todo.data.done
  }

  set done(val) {
    this.todosModule.update({
      id: this.todo.id,
      data: {
        ...this.todo.data,
        done: val,
        doneAt: val ? serverTimeStamp : null
      }
    })
  }

  startEdit(): void {
    this.$emit('startEdit')
  }
}
</script>
