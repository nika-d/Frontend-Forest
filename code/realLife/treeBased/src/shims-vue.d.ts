/* eslint-disable */

// Forces TS to apply `@quasar/app-vite` augmentations of `quasar` package
// Removing this would break `quasar/wrappers` imports as those typings are declared
//  into `@quasar/app-vite`
// As a side effect, since `@quasar/app-vite` reference `quasar` to augment it,
//  this declaration also apply `quasar` own
//  augmentations (eg. adds `$q` into Vue component context)
// Do not remove the following line:
/// <reference types="@quasar/app-vite" />

// Mocks all files ending in `.vue` showing them as plain Vue instances
// Needed to make IDE find Vue files in routes.ts
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: string
        VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined
        VUE_ROUTER_BASE: string | undefined
    }
}
