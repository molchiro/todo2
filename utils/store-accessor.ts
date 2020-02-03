import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import auth from '~/store/auth'
import projects from '~/store/projects'
import todos from '~/store/todos'
import currentUser from '~/store/currentUser'

let authStore: auth
let projectsStore: projects
let todosStore: todos
let currentUserStore: currentUser

function initialiseStores(store: Store<any>): void {
  authStore = getModule(auth, store)
  projectsStore = getModule(projects, store)
  todosStore = getModule(todos, store)
  currentUserStore = getModule(currentUser, store)
}

export {
  initialiseStores,
  authStore,
  projectsStore,
  todosStore,
  currentUserStore
}
