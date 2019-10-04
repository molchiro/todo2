<template lang="pug">
  v-container.pa-0
    draggable(
      :list="projects"
      :delay="50"
      @end="draggableEnd($event)"
    )
      v-list-item(
        v-for="project in projects"
        :key="project.id"
        @click="moveToProjectPage(project.id)"
      )
        v-row(dense)
          v-col(cols=1)
          v-col.pl-3
            v-list-item-content
              v-list-item-title {{ project.title }}
    v-list-item(@click="addProject()")
      v-row(
        dense
        align="center"
      )
        v-col(cols=1)
          v-list-item-icon
            v-icon add
        v-col.pl-3
          v-list-item-content
            v-list-item-title プロジェクトを追加
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import draggable from 'vuedraggable'
import { authStore, projectsStore } from '@/store'
import { Project } from '@/models/project'

@Component({
  components: {
    draggable
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
