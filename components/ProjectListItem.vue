<template lang="pug">
  v-list-item
    v-list-item-icon.mr-1
      v-icon
        slot(name="icon")
    v-list-item-content
      v-list-item-title
        slot(name="title")
</template>
