<template lang="pug">
  v-dialog(
    :value="value"
    @input="$emit('input', $event)"
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
            @click="$emit('input', false)"
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
import { authStore, projectsStore } from '@/store'
import { Project } from '@/models/project'
import { VForm } from '@/types/index'

@Component
export default class ProjectPostDialog extends Vue {
  @Prop() readonly value: boolean = false

  valid: boolean = true

  project: Project = new Project({ uid: authStore.currentUserUid })

  addProject(): void {
    const form = this.$refs.form as VForm
    if (form.validate()) {
      this.$emit('input', false)
      projectsStore.addProject(this.project).then((ref) => {
        this.$router.push(`/projects/${ref.id}`)
        this.project = new Project({ uid: authStore.currentUserUid })
        form.resetValidation()
      })
    }
  }
}
</script>
