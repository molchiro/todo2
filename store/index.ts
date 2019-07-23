import Vuex from 'vuex'
import AuthModule from '@/store/modules/auth'
import TodosModule from '@/store/modules/todos'

const createStore = () => {
	return new Vuex.Store({
		modules: {
      auth: AuthModule,
      todos: TodosModule
		}
	})
}
  
export default createStore