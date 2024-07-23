<script setup lang="ts">
import TerminDetails from '$src/useCases/lehrendenEintragung/components/TerminDetails.vue'
import { useRouter } from 'vue-router'
import { inject, onBeforeMount, provide, ref, Ref } from 'vue'
import { Repository } from '$src/models/repository/common/Repository'
import { Person } from '$src/models/Person'
import { Einrichtung } from '$src/models/Einrichtung'
import loadData from '$src/useCases/lehrendenEintragung/pages/dataLoaders/loadData'
import { TerminViewModel } from '$src/useCases/lehrendenEintragung/viewModel/TerminViewModel'
const router = useRouter()

const personenRepo: Ref<Repository<Person> | null> = ref(null)
const einrichtungenRepo: Ref<Repository<Einrichtung> | null> = ref(null)

const errorOnMainPage: Ref<Error | null> = inject('errorOnMainPage') as Ref<Error | null>
const loadingPromises: Ref<Promise<unknown>[]> = inject('loadingPromises') as Ref<Promise<unknown>[]>
const terminViewModels: Ref<Array<TerminViewModel>> = ref([])

provide('personenRepo', personenRepo)
provide('einrichtungenRepo', einrichtungenRepo)

onBeforeMount(() =>
    loadData(router, terminViewModels, null, null, personenRepo, einrichtungenRepo, errorOnMainPage, loadingPromises),
)
</script>

<template>
    <TerminDetails
        v-if="terminViewModels[1]"
        :person-repo="personenRepo"
        :selected-einrichtung="null"
        :einrichtung-repo="einrichtungenRepo"
        :termin-v-m="terminViewModels[1]"
    />
</template>

<style scoped lang="scss"></style>
