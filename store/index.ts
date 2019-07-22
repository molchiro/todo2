import Vuex from 'vuex'
import AuthModule from '@/store/modules/auth'

const createStore = () => {
	return new Vuex.Store({
		modules: {
      auth: AuthModule
		}
	})
}
  
export default createStore