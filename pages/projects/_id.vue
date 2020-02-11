<template lang="pug">
  v-container
    delete-dialog(
      v-model="isOpenDeleteDialog"
      :onClickDelete="deleteProject"
      :onClickCancel="closeDeleteDialog"
    ) このプロジェクトに紐づくTODOも全て削除されます。
      | この操作は取り消せません。
    v-dialog(
      v-model="isOpenShareDialog"
      max-width=300
    )
      v-card
        v-card-title 共有の設定
        div(v-if="localProject.canInvite")
          v-card-text 招待したい人に以下のURLを共有してください
          v-text-field(
            v-model="invitationUrl"
            readonly
          )
          v-btn(@click="disableInvitation()") 招待を中止
        div(v-else)
          v-card-text このプロジェクトは共有されていません
          v-btn(@click="enableInvitation()") 招待URLを取得
        v-divider
        v-card-actions
          v-row(no-gutters)
            v-col.pa-0
              v-btn(
                @click="isOpenShareDialog = false"
                text
                block
              ) 閉じる
    v-snackbar(
      v-model="isShowSnackbar"
      bottom
    ) {{ snackbarText}}
    v-container.px-2
      v-row(no-gutters)
        v-col(cols=10)
          h2
            input.fill-width(
              ref="projectTitleField"
              v-model="localProject.title"
              @keypress.enter="updateTitle($event)"
            )
        v-col.align-self-center.text-center(cols=1)
          v-icon(
            @click="isOpenShareDialog = true"
          ) share
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
import { generateUuid4 } from '@/lib/uuid'
const projectsRef = db.collection('projects')

@Component({
  components: {
    TodoList,
    DeleteDialog
  }
})
export default class projectPage extends Vue {
  isOpenDeleteDialog: boolean = false

  isOpenShareDialog: boolean = false

  isShowSnackbar: boolean = false

  snackbarText: string = ''

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

  get host(): string {
    return location.host
  }

  get invitationUrl(): string {
    return `https://${this.host}/invitation?code=${this.localProject.invitationCode}`
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

  enableInvitation(): void {
    if (!this.localProject.canInvite) {
      this.localProject.canInvite = true
      this.localProject.invitationCode = generateUuid4()
      projectsStore.updateProject(this.localProject)
      this.snackbarText = '招待URLをコピーしました'
      this.isShowSnackbar = true
    }
  }

  disableInvitation(): void {
    if (this.localProject.canInvite) {
      this.localProject.canInvite = false
      this.localProject.invitationCode = ''
      projectsStore.updateProject(this.localProject)
    }
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
