<script setup lang="ts">
import { computed, Ref, ref, inject, provide } from 'vue'

import LehrtaetigkeitForm from '$src/useCases/lehrendenEintragung/components/LehrtaetigkeitForm/LehrtaetigkeitForm.vue'
import { TerminViewModel } from '$src/useCases/lehrendenEintragung/viewModel/TerminViewModel'
import { Einrichtung } from '$src/models/Einrichtung'
import { LehrtaetigkeitFormModel } from '../viewModel/LehrtaetigkeitFormModel'
import { Repository } from '$src/models/repository/common/Repository'
import { Person } from '$src/models/Person'
import uiTextsLE from '$src/common/uiTexts/lehrendenEintragung.json'
import tags from '$test/data-testid-LEHRENDENEINTRAGUNG'
import { QDrawer, QBtn } from 'quasar'
import { QLayout, QPageContainer, QFooter } from 'quasar'

const props = defineProps<{
    terminVM: TerminViewModel | null
    selectedEinrichtung: Einrichtung | null
    personRepo: Repository<Person>
    einrichtungRepo: Repository<Einrichtung>
}>()
const terminVM = computed<TerminViewModel | null>(() => props.terminVM)

let lehrtaetigkeitFormModels: Ref<LehrtaetigkeitFormModel[]> = ref([])

provide(
    'geplanteEinrichtungenDesTermins',
    computed(() => terminVM.value?.geplanteEinrichtungen),
)
provide(
    'personenInAllenLehrtaetigkeitenDesTermins',
    computed<Set<Person>>(() => {
        return lehrtaetigkeitFormModels.value.reduce((lehrendeInAllenForms, form) => {
            if (form.person && !form.isMarkedToBeDeleted) lehrendeInAllenForms.add(form.person)
            return lehrendeInAllenForms
        }, new Set<Person>())
    }),
)

lehrtaetigkeitFormModels.value =
    terminVM.value?.lehrtaetigkeiten.map((lt) => {
        return new LehrtaetigkeitFormModel(terminVM.value!.id, lt)
    }) || []

function addLehrender() {
    const ltFormVM = new LehrtaetigkeitFormModel(terminVM.value!.id, null)
    ltFormVM.isEditMode = true
    lehrtaetigkeitFormModels.value.push(ltFormVM)
}

function quitEditMode(ltFormVM: LehrtaetigkeitFormModel, index: number) {
    if (ltFormVM.isNew) {
        lehrtaetigkeitFormModels.value.splice(index, 1)
    }
}
</script>

<template>
    <QDrawer
        :model-value="!!terminVM"
        side="right"
        bordered
        :width="700"
        elevated
        overlay
        :data-testid="tags.DRAWER.ID"
    >
        <QLayout v-if="terminVM" view="hHh lpr fFf">
            <QPageContainer class="q-px-lg">
                <div
                    v-for="(formVM, index) in lehrtaetigkeitFormModels"
                    :key="formVM.lehrtaetigkeitViewModel?.id"
                    class="q-mt-md"
                >
                    <LehrtaetigkeitForm
                        v-model:model="lehrtaetigkeitFormModels[index]"
                        @cancel-editing="quitEditMode(formVM, index)"
                    />
                </div>

                <div class="q-pt-md">
                    <QBtn
                        color="primary"
                        icon="add_circle"
                        :label="uiTextsLE.LEHRENDEN_HINZUFUEGEN"
                        :data-testid="tags.DRAWER.ADD_LEHRTAETIGKEIT"
                        flat
                        @click="addLehrender"
                    />
                </div>
            </QPageContainer>
            <QFooter :model-value="true" class="bg-white text-black text-center q-pa-lg">
                Any Lehrtaetigkeit is ready to be submitted ?
                {{ lehrtaetigkeitFormModels.some((lt) => lt.isReadyToBeSubmitted) }}
                {{ lehrtaetigkeitFormModels.some((lt) => lt.isReadyToBeSubmitted) ? '🟢' : '🔴' }}
            </QFooter>
        </QLayout>
    </QDrawer>
</template>
