<template lang="pug">
  v-dialog(
    v-model="isOpened"
    max-width=300
  )
    v-card
      v-form(
        @submit.prevent
        ref="form"
        v-model="valid"
      )
        v-card-title プロジェクトを作成
        v-card-text
          v-text-field(
            @keypress.enter="addProject()"
            autofocus
            label="プロジェクト名"
            v-model="project.title"
            :rules="[project.title.length > 0 || '必須']"
          )
        v-card-actions
          div.flex-grow-1
          v-btn(
            @click="isOpened = false"
            text
            color="blue darken-1"
          ) キャンセル
          v-btn(
            @click="addProject()"
            :disabled="!valid"
            text
            color="blue darken-1"
          ) 作成
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { functions } from '@/plugins/firebase'
import { authStore } from '@/store'
import { Project } from '@/models/project'
import { VForm } from '@/types/index'

@Component
export default class ProjectPostDialog extends Vue {
  @Prop() readonly value: boolean = false

  get isOpened(): boolean {
    return this.value
  }

  set isOpened(val) {
    this.$emit('input', val)
  }

  get currentUserUid(): string {
    return authStore.currentUser!.uid
  }

  valid: boolean = true

  project: Project = new Project({
    createdByUid: this.currentUserUid,
    members: [this.currentUserUid]
  })

  async addProject(): Promise<void> {
    const form = this.$refs.form as VForm
    if (form.validate()) {
      this.isOpened = false
      const addProject = functions.httpsCallable('addProject')
      const addProjectResult = await addProject(
        JSON.parse(JSON.stringify(this.project.data()))
      )
      this.$router.push(`/projects/${addProjectResult.data.id}`)
      this.project = new Project({
        createdByUid: this.currentUserUid,
        members: [this.currentUserUid]
      })
      form.resetValidation()
    }
  }
}
</script>
