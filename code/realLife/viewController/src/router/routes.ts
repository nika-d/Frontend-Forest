import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('../components/layouts/MainLayout.vue'),
        children: [
            { path: '', component: () => import('../useCases/lehrendenEintragung/pages/FrontendForest.vue') },
            {
                path: 'frontend-forest',
                component: () => import('../useCases/lehrendenEintragung/pages/FrontendForest.vue'),
            },
        ],
    },

    // Always leave this as last one, but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('../components/pages/ErrorNotFound.vue'),
    },
]

export default routes
