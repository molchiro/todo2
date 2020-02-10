<template lang="pug">
  v-container
    delete-dialog(
      v-model="isOpenDeleteDialog"
      :onClickDelete="deleteProject"
      :onClickCancel="closeDeleteDialog"
    ) このプロジェクトに紐づくTODOも全て削除されます。
      | この操作は取り消せません。
    v-container.px-2
      v-row(no-gutters)
        v-col(cols=11)
          h2
            input.fill-width(
              ref="projectTitleField"
              v-model="localProject.title"
              @keypress.enter="updateTitle($event)"
            )
        v-col.align-self-center.text-center(cols=1)
              v-icon(@click="openDeleteDialog()") delete
    div.text-center(v-if="isTodosLoading")
      v-progress-circular(
        indeterminate
        color="primary"
      )
    todo-list(
      v-else
      :projectId="projectId"
    )
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { projectsStore, todosStore } from '@/store'
import TodoList from '@/components/TodoList.vue'
import DeleteDialog from '@/components/DeleteDialog.vue'
import { db, functions } from '@/plugins/firebase'
import { Project } from '@/models/project'
const projectsRef = db.collection('projects')

@Component({
  components: {
    TodoList,
    DeleteDialog
  }
})
export default class projectPage extends Vue {
  isOpenDeleteDialog: boolean = false

  get projectId(): string {
    const id: string = this.$route.params.id
    projectsStore.setSelectedProjectId(id)
    return id
  }

  get project(): Project {
    return projectsStore.selectedProject
  }

  get isTodosLoading(): boolean {
    return todosStore.isLoading
  }

  get isTodosEmpty(): boolean {
    return todosStore.isEmpty
  }

  get localProject(): Project {
    return new Project(this.project)
  }

  get canUpdate(): boolean {
    const isChanged = this.localProject.title !== this.project.title
    return isChanged && this.localProject.isValid()
  }

  created(): void {
    todosStore.bindTodos(this.projectId)
  }

  async validate({ params }): Promise<boolean> {
    const isProjectExists = await projectsRef
      .doc(params.id)
      .get()
      .then((snapshot) => {
        return snapshot.exists
      })
    return isProjectExists
  }

  updateTitle(event): void {
    if (this.canUpdate) {
      projectsStore.updateProject(this.localProject)
    }
    event.srcElement.blur()
  }

  async deleteProject(): Promise<void> {
    const deleteProject = functions.httpsCallable('deleteProject')
    await deleteProject(this.localProject.id)
    this.closeDeleteDialog()
    this.$router.push('/')
  }

  openDeleteDialog(): void {
    this.isOpenDeleteDialog = true
  }

  closeDeleteDialog(): void {
    this.isOpenDeleteDialog = false
  }
}
</script>

<style lang="sass" scoped>
.fill-width
  width: 100%
</style>
