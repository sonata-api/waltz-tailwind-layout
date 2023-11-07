<script setup lang="ts">
import {
  type MenuSchema,
  useStore,
  useRouter,
  useNavbar,
  useBreakpoints

} from 'waltz-ui'

import {
  inject,
  ref,
  reactive,
  toRefs,
  computed,
  onMounted

} from 'vue'

import {
  WInfo,
  WIcon,
  WContextMenu,
  WPicture,
  WBadge,
  WAsync

} from '@waltz-ui/ui'

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
const userStore = useStore('user')
const breakpoints = useBreakpoints()

const push = (...args: Parameters<typeof router.push>) => {
  window.scrollTo(0, 0)
  router.push(...args)

  if( !breakpoints.value.md ) {
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
      tw-z-40
      lg:tw-w-[20rem]
      ${
        metaStore.menu.visible
          ? 'tw-flex'
          : 'tw-hidden lg:tw-flex'
      }
    `">
      <div
        data-component="super-navbar"
        class="
          tw-flex
          tw-flex-col
          tw-p-4
          tw-bg-gray-100
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
                tw-rounded-xl
                tw-justify-center
                on-hover
                ${index === expandedIndex && 'current'}
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
          tw-bg-gray-50
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
              tw-rounded-xl
              tw-p-4
              on-hover
              [&>[data-component=icon-label]]:tw-w-full
              ${isCurrent(subitem) && 'current'}
            `"

            @click="push({ name: subitem.name })"
          >
            <div class="
              tw-flex
              tw-justify-between
              tw-items-center
            ">
              <div>{{ capitalize($t(subitem.meta.title)) }}</div>
              <w-badge v-if="subitem.badge">
                <w-async
                  :promise="subitem.badge()"
                ></w-async>
              </w-badge>
            </div>
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
        tw-px-4
        tw-gap-6
        tw-shadow
        tw-h-[4.8rem]
        lg:tw-px-8
        lg:tw-shadow-none
        lg:tw-h-[6rem]
        w-surface
        view-top
      ">
        <w-icon
          v-if="!breakpoints.lg"
          v-clickable
          icon="bars"
          @click="metaStore.menu.visible = true"
        ></w-icon>

        <img
          v-if="!breakpoints.md"
          v-clickable
          :src="logoUrl"
          class="
            tw-h-12
            tw-w-16
            tw-object-contain
          "
          @click="push('/dashboard')"
        />

        <w-icon
          v-else
          :icon="viewIcon"
          class="
            tw-text-lg
            tw-font-[600]
          "
        >
          {{ capitalize(viewTitle) }}
        </w-icon>

        <router-view
          v-if="breakpoints.md"
          name="topbar"
        ></router-view>

        <div class="tw-ml-auto">
          <slot
            v-if="$slots.super"
            name="super"
          ></slot>
        </div>

        <w-context-menu>
          <w-picture
            v-clickable
            :file-id="currentUser.picture?._id || currentUser.picture"
            class="
              tw-rounded-full
              tw-overflow-hidden
              tw-border
              tw-w-12
              tw-h-12
            "

          ></w-picture>

          <template #header>
            <div class="
              tw-flex
              tw-flex-col
              tw-items-start
              tw-gap-1
              tw-bg-gray-50
              tw-p-4
            ">
              <div class="tw-text-[12pt]">
                {{ currentUser.full_name }}
              </div>

              <div>
                <div
                  v-for="role in currentUser.roles"
                  :key="`role-${role}`"
                  class="
                    tw-bg-blue-100
                    tw-p-2
                    tw-rounded-md
                    tw-text-[8pt]
                    tw-text-blue-800
                  "
                >
                  {{ $t(role) }}
                </div>
              </div>
            </div>
          </template>

          <template #profile>
            <w-icon
              icon="user-square"
              @click="router.push('/dashboard/user/profile')"
            >
              Perfil
            </w-icon>
          </template>

          <template #logout>
            <w-icon
              icon="signout"
              @click="userStore.$actions.signout(); router.push('/user/signin')"
            >
              Sair
            </w-icon>
          </template>
        </w-context-menu>

      </div>

      <div class="
        tw-flex
        tw-flex-col
        tw-gap-[1.4rem]
        tw-pt-6
        tw-pb-6
        tw-px-4
        lg:tw-pt-0
        lg:tw-px-8
        tw-max-w-full
      ">
        <router-view
          v-if="!breakpoints.md"
          name="topbar"
        ></router-view>

        <div class="
          tw-flex
          tw-flex-col
          tw-gap-[1rem]
        ">
          <router-view v-slot="{ Component }">
            <component :is="Component"></component>
          </router-view>
        </div>
      </div>

    </div>
  </div>

</template>

<style scoped lang="scss">
.view-top {
  @media print {
    display: relative !important;
  }

  @media screen and (min-width: 600px) {
    background: var(--theme-body-background);
  }
}

.on-hover:hover {
  background: var(--theme-background-color-hover);
}

.current {
  color: var(--theme-brand-color);
  fill: var(--theme-brand-color);
  background: var(--theme-background-color-contrast);
}
</style>
