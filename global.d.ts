declare module 'vue-router/auto' {
  import { createRouter as cr, createWebHistory, Router, RouteRecordRaw } from 'vue-router'
  export const createRouter: (config: Omit<Parameters<typeof cr>[0], 'routes'> & {
    extendRoutes: (routes: Array<RouteRecordRaw>) => Array<RouteRecordRaw>
  }) => Router

  export {
    Router,
    RouteRecordRaw,
    createWebHistory
  }
}

declare var userStorage: typeof localStorage | typeof sessionStorage
declare var ROUTER: any
declare var I18N: any
declare var STORES: Record<string, any>
declare var QUERY_CACHE: Record<string, {
  items: Array<any>
  satisfied: boolean
}>

declare var INSTANCE_VARS: {
  themes?: Array<string>
  darkThemes?: Array<string>
  dashboardLayout?: Record<string, {
  }>
}

declare var PINIA: any
