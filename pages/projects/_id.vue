<template lang="pug">
  v-container
    delete-dialog(
      v-model="isShowDeleteDialog"
      @delete="deleteProject()"
    ) このプロジェクトに紐づくTODOも全て削除されます。<br/>この操作は取り消せません。
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
          v-icon(@click="isShowDeleteDialog = true") delete
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
import { authStore, projectsStore, todosStore } from '@/store'
import TodoList from '@/components/TodoList.vue'
import DeleteDialog from '@/components/DeleteDialog.vue'
import { db } from '@/plugins/firebase'
import { Project } from '@/models/project'
const projectsRef = db.collection('projects')

@Component({
  components: {
    TodoList,
    DeleteDialog
  }
})
export default class projectPage extends Vue {
  isShowDeleteDialog: boolean = false

  get projectId(): string {
    return this.$route.params.id
  }

  get project(): Project {
    const p = projectsStore.getProjects.find((x) => {
      return x.id === this.projectId
    })
    if (p) {
      return p
    } else {
      return new Project({ title: '' })
    }
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
    todosStore.bindTodos({
      uid: authStore.currentUserUid,
      projectId: this.projectId
    })
  }

  mounted(): void {
    if (this.project.isDefaultTitle()) {
      // @ts-ignore
      this.$refs.projectTitleField.focus()
    }
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

  deleteProject(): void {
    projectsStore.deleteProject(this.localProject)
    this.isShowDeleteDialog = false
    this.$router.push('/')
  }
}
</script>

<style lang="sass" scoped>
.fill-width
  width: 100%
</style>
