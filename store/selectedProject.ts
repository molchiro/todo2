import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { db } from '@/plugins/firebase'
import { authStore } from '@/store'
import { Project } from '~/models/project'

const projectsRef = db.collection('projects')


@Module({
  namespaced: true,
  name: 'selectedProject',
  stateFactory: true
})
export default class SelectedProjectModule extends VuexModule {
  innerProject: Project = new Project({})

  get project(): Project {
    return new Project({ ...this.innerProject })
  }

  @Mutation
  private REPLACE_PROJECT(project: Project): void {
    this.innerProject = new Project({ ...project })
  }

  @Action
  bindProject(id): void {
    const mapDoc2Project = (doc: firebase.firestore.DocumentSnapshot) => {
      return new Project(
        {
          ...doc.data(),
          id: doc.id,
        }
      )
    }
    projectsRef.doc(id).onSnapshot((snapshot) => {
      this.REPLACE_PROJECT(mapDoc2Project(snapshot))
    })
  }
}