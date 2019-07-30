import { getModule } from 'vuex-module-decorators'
import AuthModule from '@/store/modules/auth'

export default async ({ route, store, redirect }) => {
  const authModule = getModule(AuthModule, store)
  if (!authModule.isAuthed) await authModule.getCurrentUser()
  if (!authModule.isAuthed) {
    if (route.name !== 'sign_in') redirect('/sign_in')
  } else if (route.name === 'sign_in') redirect('/')
}
