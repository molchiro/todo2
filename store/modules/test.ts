import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module({ namespaced: true, name: 'test' })
export default class TestModule extends VuexModule {
  hoge: string = 'hoge'

  @Mutation
  updateHoge(s: string) {
    this.hoge = s
  }
  @Action
  incr() {
    this.updateHoge(this.hoge + '!')
  }
}