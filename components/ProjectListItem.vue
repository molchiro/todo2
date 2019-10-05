<template lang="pug">
  v-list-item
    v-row(
      dense
      align="center"
    )
      v-col(cols=1)
        v-list-item-icon
          v-icon
            slot(name="icon")
      v-col.pl-3
        v-list-item-content
          v-list-item-title
            slot(name="title")
</template>
