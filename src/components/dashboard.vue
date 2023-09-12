<script setup lang="ts">
import { type MenuSchema, useStore, useRouter, useNavbar, useBreakpoints } from 'waltz-ui'
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
const metaStore = useStore('meta')
const breakpoints = useBreakpoints()


const push = (...args: Parameters<typeof router.push>) => {
  window.scrollTo(0, 0)
  router.push(...args)

  if( !breakpoints.md ) {
    metaStore.menu.visible = false
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
    w-body
  ">
    <nav :class="`
      no-print
      tw-sticky
      tw-inset-0
      tw-w-screen
      tw-h-screen
      tw-overflow-hidden
      tw-border-r
      tw-bg-gray-50
      tw-z-40
      lg:tw-w-[20rem]
      ${
        metaStore.menu.visible
          ? 'tw-flex'
          : 'tw-hidden lg:tw-flex'
      }
    `">
      <div class="
        tw-flex
        tw-flex-col
        tw-border-r
        tw-p-4
        tw-bg-white
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
          @click="push('/dashboard')"
        />

        <div class="
          tw-flex
          tw-flex-col
          tw-items-center
          tw-gap-4
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
              @click="
                expandedIndex = index;
                breakpoints.md && push({ name: expandedMenu.children[0].name })
              "
            ></w-icon>
          </w-info>

        </div>
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
            tw-font-[500]
            tw-text-lg
          ">
            {{ expandedMenu.meta.title }}
          </div>

          <div class="lg:tw-hidden">
            <w-icon
              icon="multiply"
              @click="metaStore.menu.visible = false"
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

            @click="push({ name: subitem.name })"
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
        tw-z-20
        tw-px-8
        tw-gap-6
        tw-shadow
        lg:tw-shadow-none
        lg:tw-border-b
        w-surface
        tw-h-[4.6rem]
        view-top
      ">
        <w-icon
          v-if="!breakpoints.md"
          v-clickable
          icon="bars"
          @click="metaStore.menu.visible = true"
        ></w-icon>

        <img
          v-if="!breakpoints.md"
          v-clickable
          :src="logoUrl"
          class="
            tw-h-16
            tw-w-20
            tw-object-contain
          "
          @click="push('/dashboard')"
        />

        <w-icon
          v-else
          :icon="viewIcon"
        >
          {{ capitalize(viewTitle) }}
        </w-icon>

        <div class="tw-ml-auto">
          <slot
            v-if="$slots.super"
            name="super"
          ></slot>
        </div>

        <w-picture
          v-clickable
          :file-id="currentUser.picture?._id || currentUser.picture"
          class="
            tw-rounded-full
            tw-overflow-hidden
            tw-border
            tw-w-10
            tw-h-10
          "

          @click="push('/dashboard/user/profile')"
        ></w-picture>


        <!-- <slot -->
        <!--   v-if="$slots.super && breakpoints.md" -->
        <!--   name="super" -->
        <!-- ></slot> -->


      </div>

      <!-- <div -->
      <!--   v-if=" -->
      <!--     breakpoints.md -->
      <!--     || $slots.super -->
      <!--     || hasTopbar -->
      <!--   " -->

      <!--   class=" -->
      <!--     tw-inset-0 -->
      <!--     tw-flex -->
      <!--     tw-flex-col -->
      <!--     tw-gap-[1rem] -->
      <!--     tw-px-4 -->
      <!--     tw-pt-6 -->
      <!--     lg:tw-pt-0 -->
      <!--     lg:tw-flex-row -->
      <!--     lg:tw-items-center -->
      <!--     lg:tw-gap-6 -->
      <!--     lg:tw-px-8 -->
      <!--     lg:tw-h-[5.4rem] -->
      <!--     w-surface -->
      <!--     view-top -->
      <!--   " -->
      <!-- > -->
      <!--   <!-1- <w-icon -1-> -->
      <!--   <!-1-   v-if="breakpoints.md" -1-> -->
      <!--   <!-1-   :icon="viewIcon" -1-> -->
      <!--   <!-1-   class="tw-text-lg" -1-> -->
      <!--   <!-1- > -1-> -->
      <!--   <!-1-   {{ capitalize(viewTitle) }} -1-> -->
      <!--   <!-1- </w-icon> -1-> -->

      <!--   <!-1- <router-view name="topbar"></router-view> -1-> -->

      <!--   <!-1- <slot -1-> -->
      <!--   <!-1-   v-if="$slots.super && breakpoints.md" -1-> -->
      <!--   <!-1-   name="super" -1-> -->
      <!--   <!-1- ></slot> -1-> -->

      <!-- </div> -->

      <div class="
        tw-flex
        tw-flex-col
        tw-gap-[2rem]
        tw-py-6
        tw-px-4
        lg:tw-px-8
      ">
        <router-view name="topbar"></router-view>
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
