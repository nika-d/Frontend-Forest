<script setup lang="ts">
import { computed, Ref, ref, watch } from 'vue'

import LehrtaetigkeitForm from '$src/useCases/lehrendenEintragung/components/LehrtaetigkeitForm/LehrtaetigkeitForm.vue'
import { TerminViewModel } from '$src/useCases/lehrendenEintragung/viewModel/TerminViewModel'
import { Einrichtung } from '$src/models/Einrichtung'
import { LehrtaetigkeitFormViewModel } from '../viewModel/LehrtaetigkeitFormViewModel'
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

let lehrtaetigkeitenFormsVMs: Ref<LehrtaetigkeitFormViewModel[]> = ref([])

const lehrendeInAllenForms = computed<Set<Person>>(() => {
    return lehrtaetigkeitenFormsVMs.value.reduce((lehrendeInAllenForms, form) => {
        if (form.person && !form.isMarkedToBeDeleted) lehrendeInAllenForms.add(form.person)
        return lehrendeInAllenForms
    }, new Set<Person>())
})

lehrtaetigkeitenFormsVMs.value =
    terminVM.value?.lehrtaetigkeiten.map((lt) => {
        return new LehrtaetigkeitFormViewModel(
            terminVM.value!.id,
            terminVM.value!.geplanteEinrichtungen,
            lt,
            props.einrichtungRepo,
        )
    }) || []

watch(lehrtaetigkeitenFormsVMs, () => {
    saveControls.value!.formVM = lehrtaetigkeitenFormsVMs.value
})

function addLehrender() {
    const ltFormVM = new LehrtaetigkeitFormViewModel(
        terminVM.value!.id,
        terminVM.value!.geplanteEinrichtungen,
        null,
        props.einrichtungRepo,
    )
    ltFormVM.isEditMode = true
    lehrtaetigkeitenFormsVMs.value.push(ltFormVM)
}

function quitEditMode(ltFormVM: LehrtaetigkeitFormViewModel, index: number) {
    if (ltFormVM.isNew) {
        lehrtaetigkeitenFormsVMs.value.splice(index, 1)
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
                    v-for="(formVM, index) in lehrtaetigkeitenFormsVMs"
                    :key="formVM.lehrtaetigkeitViewModel?.id"
                    class="q-mt-md"
                >
                    <LehrtaetigkeitForm
                        v-model="lehrtaetigkeitenFormsVMs[index]"
                        :lehrende-in-allen-forms="lehrendeInAllenForms"
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
                {{ lehrtaetigkeitenFormsVMs.some((lt) => lt.isReadyToBeSubmitted) }}
                {{ lehrtaetigkeitenFormsVMs.some((lt) => lt.isReadyToBeSubmitted) ? '🟢' : '🔴' }}
            </QFooter>
        </QLayout>
    </QDrawer>
</template>
