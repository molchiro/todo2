<template lang="pug">
  v-dialog(
    :value="value"
    @input="$emit('input', $event)"
    max-width=300
  )
    v-card
      v-card-title 削除しますか？
      v-card-text
        slot
      v-divider
      v-card-actions
        v-row(no-gutters)
          v-col.pa-0
            v-btn(
              @click="$emit('input', false)"
              text
              block
            ) キャンセル
          v-divider.mx-2(vertical)
          v-col.pa-0
            v-btn(
              @click="$emit('delete')"
              text
              block
              color="red"
            ) 削除
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class DeleteDialog extends Vue {
  @Prop() readonly value: boolean = false
}
</script>
