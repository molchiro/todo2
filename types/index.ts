import { Vue } from 'nuxt-property-decorator'

export type VForm = Vue & {
    reset: () => void,
    resetValidation: () => void
    validate: () => boolean
}