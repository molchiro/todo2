<template lang="pug">
  v-dialog(
    v-model="isOpened"
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
              @click="onClickCancel"
              text
              block
            ) キャンセル
          v-divider.mx-2(vertical)
          v-col.pa-0
            v-btn(
              @click="onClickDelete"
              text
              block
              color="red"
            ) 削除
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class DeleteDialog extends Vue {
  @Prop() readonly onClickDelete: Function

  @Prop() readonly onClickCancel: Function

  @Prop({ default: false }) readonly value: boolean

  get isOpened() {
    return this.value
  }

  set isOpened(val) {
    this.$emit('input', val)
  }
}
</script>
