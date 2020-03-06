import { authStore } from '@/store'
import { currentUserStore } from '@/store'

export default async ({ route, redirect }) => {
  if (await authStore.authenticate()) {
    if (!currentUserStore.isExists) {
      if (await currentUserStore.loadCurrentUser()) {
        if (route.name === 'sign_in') redirect('/')
      } else {
        if (route.name === 'register') return
        redirect(`/register?fromPath=${route.fullPath}`)
      }
    }
  } else {
    if (route.name === 'sign_in' || route.name === 'invitation-code') return
    redirect('/sign_in')
  }
}
