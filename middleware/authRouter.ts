import { getModule } from 'vuex-module-decorators'
import AuthModule from '@/store/modules/auth'

export default async ({ route, store, redirect }) => {
  const authModule = getModule(AuthModule, store)
  const authedUserUid = await authModule.getCurrentUserUid()
  if (authedUserUid) {
    if (route.name === 'sign_in') redirect('/')
  } else {
    if (route.name !== 'sign_in') redirect('/sign_in')
  }
}
