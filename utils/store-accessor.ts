import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import auth from '~/store/auth'
import projects from '~/store/projects'
import todos from '~/store/todos'

let authStore: auth
let projectsStore: projects
let todosStore: todos

function initialiseStores(store: Store<any>): void {
  authStore = getModule(auth, store)
  projectsStore = getModule(projects, store)
  todosStore = getModule(todos, store)
}

export {
  initialiseStores,
  authStore,
  projectsStore,
  todosStore
}
