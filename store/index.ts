import Vuex from 'vuex'
import TestModule from '@/store/modules/test'
import AuthModule from '@/store/modules/auth'

const createStore = () => {
	return new Vuex.Store({
		modules: {
      test: TestModule,
      auth: AuthModule
		}
	})
}
  
export default createStore