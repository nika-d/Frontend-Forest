<script setup lang="ts">
import uiTexts from '$src/common/uiTexts/lehrendenEintragung.json'
import tags from '$test/data-testid-LEHRENDENEINTRAGUNG'
import { onUpdated, Ref, ref } from 'vue'
import { QSelect } from 'quasar'
import { LehrtaetigkeitFormViewModel } from '$src/useCases/lehrendenEintragung/viewModel/LehrtaetigkeitFormViewModel'

const formVM = defineModel<LehrtaetigkeitFormViewModel>({ required: true })

const qSelect: Ref<QSelect | undefined> = ref()

onUpdated(function autoOpen() {
    if (!formVM.value.einrichtung) {
        qSelect.value?.showPopup()
    }
})
</script>

<template>
    <QSelect
        ref="qSelect"
        v-model="formVM.einrichtung"
        :options="formVM.einrichtungsOptionen"
        option-label="bezeichnungGekuerzt"
        :label="uiTexts.EINRICHTUNGEN.EINRICHTUNG"
        :disable="!formVM.einrichtungsOptionen || formVM.einrichtungsOptionen.length === 1"
        class="bg-white"
        :data-testid="tags.DRAWER.LEHRTAETIGKEIT_FORM.EINRICHTUNG"
    >
    </QSelect>
</template>
