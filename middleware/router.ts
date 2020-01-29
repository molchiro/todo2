import { authStore } from '@/store'
import { currentUserStore } from '@/store'

export default async ({ route, redirect }) => {
  if (await authStore.authenticate()) {
    if (!currentUserStore.isExists) {
      if (await currentUserStore.loadCurrentUser()) {
        if (route.name === 'sign_in') redirect('/')
      } else {
        if (route.name !== 'register') redirect('/register')
      }
    }
  } else {
    if (route.name !== 'sign_in') redirect('/sign_in')
  }
}
