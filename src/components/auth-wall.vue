<script setup lang="ts">
import { provide } from 'vue'

provide('buttonSize', 'large')
provide('buttonVariant', 'brand')
provide('inputVariant', 'bold')
provide('innerInputLabel', true)
</script>

<template>
  <div class="
    tw-flex
    tw-h-screen
  ">
    <div class="
      tw-flex
      tw-flex-1
      tw-flex-col
      tw-justify-center
      tw-items-center
      w-surface
    ">
      <div class="
        tw-flex
        tw-flex-col
        tw-gap-6
        tw-p-6
        tw-w-screen
        md:tw-p-0
        md:tw-w-[30rem]
      ">
        <router-view></router-view>
      </div>
    </div>
    <div class="
      tw-min-w-[30rem]
      tw-bg-blue-900
    "></div>
  </div>
</template>
