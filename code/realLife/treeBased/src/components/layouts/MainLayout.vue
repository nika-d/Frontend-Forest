<script setup lang="ts">
import { onErrorCaptured, provide, ref } from 'vue'
import handleError from '$src/common/alerts/error/handleError'
import ErrorPage from '$src/components/pages/ErrorPage.vue'
import LoadingPromisesPage from '$src/components/pages/LoadingPromisesPage.vue'
import { QLayout, QHeader, QToolbar, QToolbarTitle, QAvatar, QPageContainer } from 'quasar'

// Use Vue Component Error handling, when possible
onErrorCaptured(handleError)
// Use pure JS Error handling as fallback
window.addEventListener('error', (event) => {
    handleError(event.error)
})

const errorOnMainPage = ref<Error | null>(null)
provide('errorOnMainPage', errorOnMainPage)
const loadingPromises = ref<Promise<unknown>[]>([])
provide('loadingPromises', loadingPromises)

/** SIDEBAR DISABLED

const linksList = [
    {
        title: 'Lehrendeneintragung',
        icon: 'school',
        link: '#/termine',
    },
    {
        title: 'Style',
        icon: 'palette',
        link: '#/style',
    },
]


const leftDrawerOpen = ref(true)
const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
}*/
</script>

<template>
    <QLayout view="hHr Lpr fFr">
        <QHeader class="bg-primary text-white">
            <QToolbar>
                <!--#SIDEBAR DISABLED# <QBtn dense flat round class="text-white" icon="menu" @click="toggleLeftDrawer" />-->

                <QAvatar size="xl" class="q-ml-md q-mr-sm">
                    <img src="../../common/assets/charite_logo.svg" />
                </QAvatar>
                <QToolbarTitle class="text-subtitle2 text-weight-bold">
                    LLP > Einrichtungstermine > Lehrendeneintragung
                </QToolbarTitle>
            </QToolbar>
        </QHeader>

        <!--#SIDEBAR DISABLED#
        <QDrawer v-model="leftDrawerOpen" side="left" bordered mini class="bg-grey-2">
            <QList>
                <TheMenuItem v-for="link in linksList" :key="link.title" v-bind="link" />
            </QList>
        </QDrawer>
        -->

        <QPageContainer>
            <ErrorPage v-if="errorOnMainPage" :error="errorOnMainPage" />
            <LoadingPromisesPage v-else-if="loadingPromises.length > 0" :loading-promises="loadingPromises" />
            <RouterView v-show="!loadingPromises.length && !errorOnMainPage" />
        </QPageContainer>
    </QLayout>
</template>
