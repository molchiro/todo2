<template lang="pug">
  v-layout
    v-flex
      div {{ projectTitle }}
      todo-post.mb-2(:projectId="this.projectId")
      todo-list
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'
import TodosModule from '@/store/modules/todos'
import AuthModule from '@/store/modules/auth'
import ProjectsModule from '@/store/modules/projects'
import TodoPost from '@/components/TodoPost.vue'
import TodoList from '@/components/TodoList.vue'
import { db } from '@/plugins/firebase'
const projectsRef = db.collection('projects')

@Component({
  components: {
    TodoPost,
    TodoList
  }
})
export default class projectPage extends Vue {
  todosModule = getModule(TodosModule, this.$store)

  authModule = getModule(AuthModule, this.$store)

  projectsModule = getModule(ProjectsModule, this.$store)

  get projectId(): string {
    return this.$route.params.id
  }

  get projectTitle(): string {
    const project = this.projectsModule.getProjects.find((x) => {
      return x.id === this.projectId
    })
    if (project) {
      return project.title
    } else {
      return ''
    }
  }

  created(): void {
    this.todosModule.bindTodos({
      uid: this.authModule.currentUserUid,
      projectId: this.projectId
    })
  }

  validate({ params }) {
    return projectsRef.doc(params.id).get()
  }
}
</script>
