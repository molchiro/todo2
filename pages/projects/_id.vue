<template lang="pug">
  v-sheet
    delete-dialog(
      v-model="isShowDeleteDialog"
      @delete="deleteProject()"
    ) このプロジェクトに紐づくTODOも全て削除されます。<br/>この操作は取り消せません。
    v-container.px-2
      v-row(no-gutters)
        v-col(cols=11)
          h2
            input(
              ref="projectTitleField"
              v-model="localProject.title"
              @keypress.enter="updateTitle($event)"
            )
        v-col.align-self-center(cols=1)
          v-icon(@click="isShowDeleteDialog = true") delete
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
import DeleteDialog from '@/components/DeleteDialog.vue'
import { db } from '@/plugins/firebase'
import { Project } from '@/models/project'
const projectsRef = db.collection('projects')

@Component({
  components: {
    TodoPost,
    TodoList,
    DeleteDialog
  }
})
export default class projectPage extends Vue {
  todosModule = getModule(TodosModule, this.$store)

  authModule = getModule(AuthModule, this.$store)

  projectsModule = getModule(ProjectsModule, this.$store)

  isShowDeleteDialog: boolean = false

  get projectId(): string {
    return this.$route.params.id
  }

  get project(): Project {
    const p = this.projectsModule.getProjects.find((x) => {
      return x.id === this.projectId
    })
    if (p) {
      return p
    } else {
      return new Project({ title: '' })
    }
  }

  get localProject(): Project {
    return new Project(this.project)
  }

  get canUpdate(): boolean {
    const isChanged = this.localProject.title !== this.project.title
    return isChanged && this.localProject.isValid()
  }

  created(): void {
    this.todosModule.bindTodos({
      uid: this.authModule.currentUserUid,
      projectId: this.projectId
    })
  }

  mounted(): void {
    if (this.project.isDefaultTitle()) {
      // @ts-ignore
      this.$refs.projectTitleField.focus()
    }
  }

  validate({ params }): boolean {
    return !!projectsRef.doc(params.id).get()
  }

  updateTitle(event): void {
    if (this.canUpdate) {
      this.projectsModule.updateProject(this.localProject)
    }
    event.srcElement.blur()
  }

  deleteProject(): void {
    this.projectsModule.deleteProject(this.localProject)
    this.isShowDeleteDialog = false
    this.$router.push('/')
  }
}
</script>
