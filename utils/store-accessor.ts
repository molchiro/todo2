import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import auth from '~/store/auth'
import usersProjects from '~/store/usersProjects'
import selectedProject from '~/store/selectedProject'
import todos from '~/store/todos'
import currentUser from '~/store/currentUser'

let authStore: auth
let usersProjectsStore: usersProjects
let selectedProjectStore: selectedProject
let todosStore: todos
let currentUserStore: currentUser

function initialiseStores(store: Store<any>): void {
  authStore = getModule(auth, store)
  usersProjectsStore = getModule(usersProjects, store)
  selectedProjectStore = getModule(selectedProject, store)
  todosStore = getModule(todos, store)
  currentUserStore = getModule(currentUser, store)
}

export {
  initialiseStores,
  authStore,
  usersProjectsStore,
  selectedProjectStore,
  todosStore,
  currentUserStore
}
