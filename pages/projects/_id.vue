<template lang="pug">
  v-container
    delete-dialog(
      v-model="isOpenDeleteDialog"
      :onClickDelete="deleteProject"
      :onClickCancel="closeDeleteDialog"
      :isDeleteInProgress="isDeleteInProgress"
    ) このプロジェクトに紐づくTODOも全て削除されます。
      | この操作は取り消せません。
    v-dialog(
      v-model="isOpenShareDialog"
      max-width=300
    )
      v-card
        v-card-title 共有の設定
        div.text-center(v-if="localProject.canInvite")
          v-card-text URLを招待する人に共有してください
          div.url-box.caption.mx-5.pa-2(ref="invitationCode") {{ invitationUrl }}
          v-btn.my-5(@click="copyInvitationCode()") URLをコピー
        div.text-center(v-else)
          v-card-text 招待URLを取得し共有を開始します
          v-btn.mb-5(@click="enableInvitation()") URLを取得
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
          v-icon(@click="isOpenShareDialog = true") share
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
      :members="members"
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
  async asyncData({ route }) {
    const getProjectMembers = functions.httpsCallable('getProjectMembers')
    const members = await getProjectMembers(route.params.id)
    return { members: members.data }
  }

  isOpenDeleteDialog: boolean = false

  isOpenShareDialog: boolean = false

  isShowSnackbar: boolean = false

  isDeleteInProgress: boolean = false

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
    const isChanged: boolean = this.localProject.title !== this.project.title
    return isChanged && this.localProject.isValid()
  }

  get invitationUrl(): string {
    return `https://${location.host}/invitation/${this.localProject.invitationCode}`
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

  copyInvitationCode(): void {
    const invitationCodeElement = this.$refs.invitationCode as HTMLElement
    const selection = document.getSelection() as Selection
    const range: Range = new Range()
    range.selectNodeContents(invitationCodeElement)
    selection.removeAllRanges()
    selection.addRange(range)
    document.execCommand('copy')
    selection.removeAllRanges()
    this.snackbarText = '招待URLをコピーしました'
    this.isShowSnackbar = true
  }

  enableInvitation(): void {
    if (!this.localProject.canInvite) {
      this.localProject.canInvite = true
      this.localProject.invitationCode = generateUuid4()
      projectsStore.updateProject(this.localProject)
    }
  }

  async deleteProject(): Promise<void> {
    this.isDeleteInProgress = true
    const deleteProject = functions.httpsCallable('deleteProject')
    await deleteProject(this.localProject.id)
    this.isDeleteInProgress = false
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
.url-box
  border: solid 1px
  border-radius: 10px
</style>
