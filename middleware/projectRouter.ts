import { getModule } from 'vuex-module-decorators'
import ProjectsModule from '@/store/modules/projects'

export default async ({ route, store, redirect }) => {
  const projectsModule = getModule(ProjectsModule, store)
  const projectIdList = projectsModule.getProjects.map((e) => {
    return e.id
  })
  if (route.name !== 'index'){
    if (!projectIdList.includes(route.params.id)) {
      redirect('/')
    }
  }
}
