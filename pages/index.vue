<template lang="pug">
  v-layout
    v-flex
      todo-post
      todo-list
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {
    TodoPost: () => import('@/components/TodoPost.vue'),
    TodoList: () => import('@/components/TodoList.vue')
  }
})
export default class indexPage extends Vue {}
</script>
