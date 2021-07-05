import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { db, functions, serverTimeStamp } from '@/plugins/firebase'
import { authStore } from '@/store'
import { Project } from '@/models/project'
const projectsRef = db.collection('projects')

@Module({
  namespaced: true,
  name: 'projects',
  stateFactory: true
})
export default class ProjectsModule extends VuexModule {
  innerProjects: Project[] = []

  selectedProjectId: string = ''

  get projects(): Project[] {
    return this.innerProjects.map(project => new Project({ ...project }))
  }

  get selectedProject(): Project {
    const selectedProject = this.innerProjects.find(x => x.id === this.selectedProjectId)
    return selectedProject ? selectedProject : new Project({})
  }

  @Mutation
  private SET_SELECTED_PROJECT_ID(id: string): void {
    this.selectedProjectId = id
  }
  
  @Mutation
  private PUSH_PROJECTS(project: Project): void {
    this.innerProjects.push(project)
  }

  @Mutation
  private REMOVE_PROJECT(project: Project): void {
    this.innerProjects = this.innerProjects.filter(el => el.id !== project.id)
  }

  @Mutation
  private REPLACE_PROJECT(project: Project): void {
    const updatedprojectIndex: number = this.innerProjects.findIndex(el => el.id === project.id)
    this.innerProjects.splice(updatedprojectIndex, 1, project)
  }

  @Action
  setSelectedProjectId(id: string): void {
    this.SET_SELECTED_PROJECT_ID(id)
  }

  @Action
  addProject(project: Project): Promise<firebase.firestore.DocumentReference> {
    return projectsRef.add(project.data())
  }

  @Action
  async deleteProject(project: Project): Promise<void> {
    const deleteProject = functions.httpsCallable('deleteProject')
    await deleteProject(project.id)
  }

  @Action
  updateProject(project: Project): void {
    project.updatedAt = serverTimeStamp
    project.updatedByUid = authStore.currentUser!.uid
    projectsRef.doc(project.id).update(project.data())
  }

  @Action
  bindProjects(): void {
    const mapDoc2Project = (doc: firebase.firestore.QueryDocumentSnapshot) => {
      return new Project(
        {
          ...doc.data(),
          id: doc.id,
        }
      )
    }
    projectsRef
      .where('members', "array-contains" , authStore.currentUser!.uid)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            this.PUSH_PROJECTS(mapDoc2Project(change.doc))
          } else if (change.type === 'modified') {
            this.REPLACE_PROJECT(mapDoc2Project(change.doc))
          } else if (change.type === 'removed') {
            this.REMOVE_PROJECT(mapDoc2Project(change.doc))
          }
        })
      })
  }
}
