<template lang="pug">
  v-container.pa-0
    project-post-dialog(v-model="isShowPostDialog")
    v-list-item-group(:value="selectedProjectIndex")
      draggable(
        :list="projects"
        :delay="50"
        @end="draggableEnd($event)"
      )
        project-list-item(
          v-for="project in projects"
          :key="project.id"
          @click.native="$router.push(`/projects/${project.id}`)"
        )
          template(v-slot:title) {{ project.title }}
    project-list-item(@click.native="isShowPostDialog = true")
      template(v-slot:icon) add
      template(v-slot:title) プロジェクトを作成
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import draggable from 'vuedraggable'
import ProjectListItem from '@/components/ProjectListItem.vue'
import ProjectPostDialog from '@/components/ProjectPostDialog.vue'
import { authStore, projectsStore } from '@/store'
import { Project } from '@/models/project'

@Component({
  components: {
    draggable,
    ProjectListItem,
    ProjectPostDialog
  }
})
export default class ProjectList extends Vue {
  isShowPostDialog: boolean = false

  get projects(): Project[] {
    return projectsStore.getProjects
  }

  get selectedProjectIndex(): Number {
    return projectsStore.selectedProjectIndex
  }

  created(): void {
    projectsStore.bindProjects(authStore.currentUserUid)
  }

  draggableEnd({ oldIndex, newIndex }): void {
    projectsStore.moveProject({ oldIndex, newIndex })
  }
}
</script>
