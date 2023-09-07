<script setup lang="ts">
import { useStore } from 'waltz-ui'
const metaStore = useStore('meta')
</script>

<template>
  <a
    v-clickable
    @click="metaStore.$actions.saveTheme(metaStore.$theme === 'default'
      ? 'dark'
      : 'default')"
  >
    alternar
  </a>
</template>
