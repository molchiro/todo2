<template lang="pug">
  v-layout
    v-flex
      todo-post.mb-2
      todo-list
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component({
  components: {
    TodoPost,
    TodoList
  }
})
export default class indexPage extends Vue {}
</script>
