import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { db } from '@/plugins/firebase'
import { Project } from '@/models/project'
const projectsRef = db.collection('projects')

@Module({
  namespaced: true,
  name: 'projects',
  stateFactory: true
})
export default class ProjectsModule extends VuexModule {
  projects: Project[] = []

  get getProjects(): Project[] {
    return this.projects.map((project) => {
      return new Project({ ...project })
    })
  }

  @Mutation
  private PUSH_PROJECTS(project: Project): void {
    this.projects.push(project)
  }

  @Mutation
  private REMOVE_PROJECT(project: Project): void {
    this.projects = this.projects.filter((el) => {
      return el.id !== project.id
    })
  }

  @Mutation
  private REPLACE_PROJECT(project: Project): void {
    const updatedprojectIndex: number = this.projects.findIndex((el) => {
      return el.id === project.id
    })
    this.projects.splice(updatedprojectIndex, 1, project)
  }

  @Action
  addProject(project: Project): void {
    projectsRef.add(project.data())
  }

  @Action
  deleteProject(project: Project): void {
    projectsRef.doc(project.id).delete()
  }

  @Action
  updateProject(project: Project): void {
    projectsRef.doc(project.id).update(project.data())
  }

  @Action
  bindProjects(uid: string): void {
    const mapDoc2Project  = (doc: firebase.firestore.QueryDocumentSnapshot) => {
      return new Project(
        {
          ...doc.data(),
          id: doc.id,
        }
      )
    }
    projectsRef
      .where('uid', '==', uid)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            this.PUSH_PROJECTS(mapDoc2Project(change.doc))
          }
          if (change.type === 'modified') {
            this.REPLACE_PROJECT(mapDoc2Project(change.doc))
          }
          if (change.type === 'removed') {
            this.REMOVE_PROJECT(mapDoc2Project(change.doc))
          }
        })
      })
  }
}