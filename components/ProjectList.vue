<template lang="pug">
  v-container.pa-0
    project-post-dialog(v-model="isShowPostDialog")
    draggable(
      v-model="projectIds"
      :delay="50"
    )
      v-list-item.cursor-pointer(
        v-for="projectId in projectIds"
        :key="projectId"
        @click="$router.push(`/projects/${projectId}`)"
        :class="projectId === selectedProjectId ? 'grey lighten-3' : ''"
        v-ripple
      )
        v-list-item-icon.mr-1
        v-list-item-content
          v-list-item-title {{ getProjectById(projectId).title }}
    v-list-item.cursor-pointer(
      @click="isShowPostDialog = true"
      v-ripple
    )
      v-list-item-icon.mr-1
        v-icon add
      v-list-item-content プロジェクトを作成
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import draggable from 'vuedraggable'
import ProjectPostDialog from '@/components/ProjectPostDialog.vue'
import { projectsStore, currentUserStore } from '@/store'
import { Project } from '@/models/project'

@Component({
  components: {
    draggable,
    ProjectPostDialog
  }
})
export default class ProjectList extends Vue {
  isShowPostDialog: boolean = false

  get projects(): Project[] {
    return projectsStore.projects
  }

  get projectIds(): string[] {
    return currentUserStore.currentUser.projectIds
  }

  set projectIds(newVal) {
    currentUserStore.updateProjctIds(newVal)
  }

  get selectedProjectId(): string {
    return projectsStore.selectedProjectId
  }

  created(): void {
    projectsStore.bindProjects()
  }

  getProjectById(projectId): Project {
    const project = this.projects.find((project) => {
      return project.id === projectId
    })
    if (project) {
      return project
    } else {
      return new Project({})
    }
  }
}
</script>
