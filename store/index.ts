import Vuex from 'vuex'
import AuthModule from '@/store/modules/auth'
import TodosModule from '@/store/modules/todos'
import ProjectsModule from '@/store/modules/projects'

const createStore = () => {
  return new Vuex.Store({
    modules: {
      auth: AuthModule,
      todos: TodosModule,
      projects: ProjectsModule
    }
  })
}

export default createStore
