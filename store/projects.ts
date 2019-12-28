import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { db } from '@/plugins/firebase'
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

  get maxPriority(): number {
    return Math.max(0, ...this.innerProjects.map(x => x.priority))
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

  @Mutation
  private SORT_PROJECTS(): void {
    this.innerProjects = [
      ...this.innerProjects.sort((a, b) => b.priority - a.priority)
    ]
  }

  @Action
  setSelectedProjectId(id: string): void {
    this.SET_SELECTED_PROJECT_ID(id)
  }

  @Action
  addProject(project: Project): Promise<firebase.firestore.DocumentReference> {
    project.priority = this.maxPriority + 1
    return projectsRef.add(project.data())
  }

  @Action
  deleteProject(project: Project): void {
    projectsRef.doc(project.id).delete().then(() => {
      db.collection('todos')
        .where('uid', '==', project.uid)
        .where('projectId', '==', project.id)
        .get().then((snapshot) => {
          snapshot.forEach((doc) => {
            doc.ref.delete()
          })
        })
    })
  }

  @Action
  updateProject(project: Project): void {
    projectsRef.doc(project.id).update(project.data())
  }

  @Action
  moveProject({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }): void {
    let newPriority: number = 0
    if (newIndex === 0) {
      newPriority = this.maxPriority + 1
    } else if (newIndex === this.innerProjects.length - 1) {
      newPriority = this.innerProjects[this.innerProjects.length - 1].priority * 0.9
    } else {
      const prevIndex = newIndex > oldIndex ? newIndex + 1 : newIndex
      const prevPriority = this.innerProjects[prevIndex - 1].priority
      const nextPriority = this.innerProjects[prevIndex].priority
      newPriority = (prevPriority + nextPriority) / 2
    }
    this.updateProject(new Project({
      ...this.innerProjects[oldIndex],
      priority: newPriority
    }))
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
      .where('uid', '==', authStore.currentUser!.uid)
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
        this.SORT_PROJECTS()
      })
  }
}