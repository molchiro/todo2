<template lang="pug">
  div
    div エラーコード: {{ error.statusCode }}
    div(v-if="error.statusCode === 404") 指定されたページが見つかりません
    div(v-else) 何らかのエラーが発生しました。
    router-link(to="/") トップページに戻る
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { NuxtError } from '@nuxt/types/app'

@Component
export default class errorPage extends Vue {
  @Prop() readonly error: NuxtError
}
</script>
