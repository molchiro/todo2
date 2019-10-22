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

  selectedProjectId: string = ''

  get getProjects(): Project[] {
    return this.projects.map((project) => { return new Project({ ...project }) })
  }

  get selectedProject(): Project {
    const p = this.projects.find((x) => {
      return x.id === this.selectedProjectId
    })
    if (p) {
      return p
    } else {
      return new Project({ title: '' })
    }
  }

  get maxPriority(): number {
    return Math.max(0, ...this.projects.map((x) => { return x.priority })
    )
  }

  @Mutation
  private SET_SELECTED_PROJECT_ID(id: string): void {
    this.selectedProjectId = id
  }
  
  @Mutation
  private PUSH_PROJECTS(project: Project): void {
    this.projects.push(project)
  }

  @Mutation
  private REMOVE_PROJECT(project: Project): void {
    this.projects = this.projects.filter((el) => { return el.id !== project.id })
  }

  @Mutation
  private REPLACE_PROJECT(project: Project): void {
    const updatedprojectIndex: number = this.projects.findIndex((el) => {
      return el.id === project.id
    })
    this.projects.splice(updatedprojectIndex, 1, project)
  }

  @Mutation
  private SORT_PROJECTS(): void {
    this.projects = [
      ...this.projects.sort((a, b) => { return b.priority - a.priority })
    ]
  }

  @Action
  setSelectedProjectId(id: string) {
    this.SET_SELECTED_PROJECT_ID(id)
  }

  @Action
  addProject(project: Project): Promise<firebase.firestore.DocumentReference> {
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
  moveProject({ oldIndex, newIndex }): void {
    let newPriority: number = 0
    if (newIndex === 0) {
      newPriority = this.maxPriority + 1
    } else if (newIndex === this.projects.length - 1) {
      newPriority = this.projects[this.projects.length - 1].priority * 0.9
    } else {
      const prevIndex = newIndex > oldIndex ? newIndex + 1 : newIndex
      const prevPriority = this.projects[prevIndex - 1].priority
      const nextPriority = this.projects[prevIndex].priority
      newPriority = (prevPriority + nextPriority) / 2
    }
    this.updateProject(new Project({
      ...this.projects[oldIndex],
      priority: newPriority
    }))
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
        this.SORT_PROJECTS()
      })
  }
}