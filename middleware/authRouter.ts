import { getModule } from 'vuex-module-decorators'
import AuthModule from '@/store/modules/auth'

export default async ({ route, store, redirect }) => {
  const authModule = getModule(AuthModule, store)
  if (await authModule.authenticate()) {
    if (route.name === 'sign_in') redirect('/')
  } else {
    if (route.name !== 'sign_in') redirect('/sign_in')
  }
}
