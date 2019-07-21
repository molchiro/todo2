import Vuex from 'vuex'
import TestModule from '@/store/modules/test'

const createStore = () => {
	return new Vuex.Store({
		modules: {
			test: TestModule
		}
	})
}
  
export default createStore