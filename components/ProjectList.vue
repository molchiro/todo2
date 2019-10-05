<template lang="pug">
  v-container.pa-0
    draggable(
      :list="projects"
      :delay="50"
      @end="draggableEnd($event)"
    )
      ProjectListItem(
        v-for="project in projects"
        :key="project.id"
        @click.native="moveToProjectPage(project.id)"
      )
        template(v-slot:title) {{ project.title }}
    ProjectListItem(@click.native="addProject()")
      template(v-slot:icon) add
      template(v-slot:title) プロジェクトを追加
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import draggable from 'vuedraggable'
import ProjectListItem from '@/components/ProjectListItem.vue'
import { authStore, projectsStore } from '@/store'
import { Project } from '@/models/project'

@Component({
  components: {
    draggable,
    ProjectListItem
  }
})
export default class ProjectList extends Vue {
  get projects(): Project[] {
    return projectsStore.getProjects
  }

  created(): void {
    projectsStore.bindProjects(authStore.currentUserUid)
  }

  draggableEnd({ oldIndex, newIndex }): void {
    projectsStore.moveProject({ oldIndex, newIndex })
  }

  addProject(): void {
    projectsStore
      .addProject(new Project({ uid: authStore.currentUserUid }))
      .then((ref) => {
        this.moveToProjectPage(ref.id)
      })
  }

  moveToProjectPage(projectId: string): void {
    this.$router.push(`/projects/${projectId}`)
  }
}
</script>
