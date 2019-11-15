<template lang="pug">
  v-container.pa-0
    project-post-dialog(v-model="isShowPostDialog")
    draggable(
      :list="projects"
      :delay="50"
      @end="draggableEnd($event)"
    )
      v-list-item.cursor-pointer(
        v-for="project in projects"
        :key="project.id"
        @click="$router.push(`/projects/${project.id}`)"
        :class="project.id === selectedProjectId ? 'grey lighten-1' : ''"
        v-ripple
      )
        v-list-item-icon.mr-1
        v-list-item-content
          v-list-item-title {{ project.title }}
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
import { authStore, projectsStore } from '@/store'
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
    return projectsStore.getProjects
  }

  get selectedProjectId(): String {
    return projectsStore.selectedProjectId
  }

  created(): void {
    projectsStore.bindProjects(authStore.currentUserUid)
  }

  draggableEnd({ oldIndex, newIndex }): void {
    projectsStore.moveProject({ oldIndex, newIndex })
  }
}
</script>
