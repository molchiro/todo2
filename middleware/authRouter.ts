import { authStore } from '@/store'

export default async ({ route, redirect }) => {
  if (await authStore.authenticate()) {
    if (route.name === 'sign_in') redirect('/')
  } else {
    if (route.name !== 'sign_in') redirect('/sign_in')
  }
}
