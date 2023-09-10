<script setup lang="ts">
import { useStore, WIcon } from 'waltz-ui'
const metaStore = useStore('meta')
</script>

<template>
    <!-- <w-icon icon="moon"></w-icon> -->
    <!-- <w-icon icon="sun"></w-icon> -->
    <w-icon
      v-clickable
      :icon="metaStore.$theme === 'dark'
        ? 'moon'
        : 'sun'
      "

      @click="metaStore.$actions.saveTheme(metaStore.$theme === 'default'
        ? 'dark'
        : 'default')
      "
    ></w-icon>
</template>
