<script setup lang="ts">
import { type MenuSchema, useRouter, useNavbar } from 'waltz-ui'
import { inject, ref, reactive, toRefs, computed, onMounted } from 'vue'
import { WInfo, WIcon, WPicture } from '@waltz-ui/ui'

const menuSchema = inject<MenuSchema>('menuSchema')

const navbarRefs = reactive({
  routesWithChildren: [],
  isCurrent: (..._args: Parameters<Awaited<ReturnType<typeof useNavbar>>['isCurrent']>) => false
})

const {
  routesWithChildren,
  isCurrent

} = toRefs(navbarRefs)

const router = await useRouter()
const menuVisible = ref(false)

const push = (options: { close?: boolean } | null, ...args: Parameters<typeof router.push>) => {
  window.scrollTo(0, 0)
  router.push(...args)

  if( options?.close ) {
    menuVisible.value = false
  }
}

onMounted(async () => {
  const navbar = await useNavbar({ schema: menuSchema })
  Object.assign(navbarRefs, navbar)
})

const expandedIndex = ref(0)
const expandedMenu = computed(() => routesWithChildren.value[expandedIndex.value])

const logoUrl = new URL('/static/logo.png', import.meta.url).href
</script>

<template>
  <div class="
    lg:tw-flex
    w-surface
  ">
    <nav :class="`
      no-print
      tw-sticky
      tw-inset-0
      tw-h-screen
      tw-overflow-hidden
      tw-border-r
      tw-bg-gray-50
      lg:tw-w-[20rem]
      tw-z-50
      w-surface-alt
      ${
        menuVisible
          ? 'tw-flex'
          : 'tw-hidden lg:tw-flex'
      }
    `">
      <div class="
        tw-flex
        tw-flex-col
        tw-border-r
        tw-p-4
      ">
        <img
          v-clickable
          :src="logoUrl"
          class="
            tw-h-16
            tw-w-16
            tw-object-contain
            tw-mb-6
          "
          @click="push({ close: true }, '/dashboard')"
        />
        <div class="
          tw-flex
          tw-flex-col
          tw-items-center
          tw-gap-4
          tw-mb-auto
        ">
          <w-info
            where="right"
            v-for="(item, index) in routesWithChildren"
            :key="`item-${index}`"
          >
            <template #text>
              {{ item.meta.title }}
            </template>
            <w-icon
              v-clickable
              :class="`
                tw-p-4
                tw-border
                tw-rounded-xl
                tw-justify-center
                on-hover
                ${index === expandedIndex && 'active'}
              `"

              :icon="item.meta.icon"
              @click="expandedIndex = index; push(null, { name: expandedMenu.children[0].name })"
            ></w-icon>
          </w-info>

        </div>

        <w-picture
          v-clickable
          :file-id="currentUser.picture?._id || currentUser.picture"
          class="
            tw-rounded-full
            tw-overflow-hidden
            tw-border-2
            tw-w-16
            tw-h-16
          "

          @click="push({ close: true }, '/dashboard/user/profile')"
        ></w-picture>
      </div>

      <div
        v-if="expandedMenu"
        class="
          tw-flex
          tw-flex-col
          tw-flex-1
          tw-p-4
        "
      >
        <div class="
          tw-flex
          tw-items-center
          tw-justify-between
        ">
          <div class="
            tw-p-4
            tw-font-bold
            tw-text-lg
          ">
            {{ expandedMenu.meta.title }}
          </div>

          <div class="lg:tw-hidden">
            <w-icon
              icon="multiply"
              @click="menuVisible = false"
            ></w-icon>
          </div>
        </div>

        <div class="
          tw-flex
          tw-flex-col
          tw-gap-2
        ">
          <w-icon
            v-clickable
            v-for="(subitem, index) in expandedMenu.children"
            :key="`subitem-${index}`"
            :icon="subitem.meta.icon"

            :class="`
              tw-font-[300]
              tw-text-[10pt]
              tw-rounded-xl
              tw-p-4
              on-hover
              ${isCurrent(subitem) && 'current'}
            `"

            @click="push({ close: true }, { name: subitem.name })"
          >
            {{ capitalize(subitem.meta.title) }}
          </w-icon>
        </div>
      </div>

    </nav>

    <div class="
      tw-flex
      tw-flex-col
      tw-flex-1
    ">
      <div class="
        tw-sticky
        tw-inset-0
        tw-flex
        tw-items-center
        tw-gap-6
        tw-px-8
        tw-z-20
        tw-h-[4.8rem]
        lg:tw-h-[6rem]
        w-surface
        view-top
      ">
        <w-icon
          :icon="viewIcon"
          class="
            tw-text-xl
          "
        >
          {{ capitalize(viewTitle) }}
        </w-icon>

        <router-view name="topbar"></router-view>
        <div class="
          tw-flex
          tw-items-center
          tw-ml-auto
          tw-gap-6
        ">
          <slot v-if="$slots.super" name="super"></slot>

          <div
            class="lg:tw-hidden"
            @click="menuVisible = true"
          >
            <w-icon
              v-clickable
              icon="bars"
            ></w-icon>
          </div>
        </div>
      </div>

      <div class="
        tw-flex
        tw-flex-col
        tw-gap-[2rem]
        tw-px-4
        tw-pb-8
        lg:tw-px-8
      ">
        <router-view></router-view>
      </div>
    </div>
  </div>

</template>

<style scoped lang="scss">
@media print {
  .view-top {
    display: relative !important;
  }
}

.on-hover:hover {
  @include themed() {
    background: t(background-color-hover);
  }
}
</style>
