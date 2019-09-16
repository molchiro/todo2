<template lang="pug">
  div
    v-list-item(
      v-for="project in projects"
      :key="project.id"
      @click="moveToProjectPage(project.id)"
    )
      v-list-item-content
        v-list-item-title {{ project.title }}
    v-list-item(@click="addProject")
      v-list-item-icon
        v-icon add
      v-list-item-content
        v-list-item-title プロジェクトを追加
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import ProjectsModule from '@/store/modules/projects'
import AuthModule from '@/store/modules/auth'
import { Project } from '@/models/project'

@Component
export default class ProjectList extends Vue {
  projectsModule = getModule(ProjectsModule, this.$store)

  authModule = getModule(AuthModule, this.$store)

  get projects(): Project[] {
    return this.projectsModule.getProjects
  }

  created(): void {
    this.projectsModule.bindProjects(this.authModule.currentUserUid)
  }

  addProject(): void {
    this.projectsModule.addProject(
      new Project({ uid: this.authModule.currentUserUid })
    )
  }

  moveToProjectPage(projectId: string): void {
    this.$router.push(`projects/${projectId}`)
  }
}
</script>
