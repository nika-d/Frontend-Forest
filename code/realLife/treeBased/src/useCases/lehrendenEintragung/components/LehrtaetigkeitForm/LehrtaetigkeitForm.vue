<script setup lang="ts">
import { Ref, ref, watch } from 'vue'

import uiTexts from '$src/common/uiTexts/lehrendenEintragung.json'
import tags from '$test/data-testid-LEHRENDENEINTRAGUNG'
import LehrtaetigkeitCardLayout from '../LehrtaetigkeitCardLayout.vue'
import { LehrtaetigkeitFormModel } from '../../viewModel/LehrtaetigkeitFormModel'
import PersonForm from './PersonForm/PersonForm.vue'
import EinrichtungForm from './EinrichtungForm.vue'
import { QToggle, QBtn } from 'quasar'
import { Eintragungshindernis } from '$src/useCases/lehrendenEintragung/models/Eintragungshindernis/Eintragungshindernis'
import { EintragungshindernisUngeplanteEinrichtung } from '$src/useCases/lehrendenEintragung/models/Eintragungshindernis/EintragungshindernisUngeplanteEinrichtung'
import { EintragungshindernisLehrender } from '$src/useCases/lehrendenEintragung/models/Eintragungshindernis/EintragungshindernisLehrender'

const model = defineModel<LehrtaetigkeitFormModel>('model', { required: true })

const eintragungshindernisFromPersonForm: Ref<Eintragungshindernis | undefined> = ref(
    model.value.eintragungshindernis instanceof EintragungshindernisLehrender
        ? model.value.eintragungshindernis
        : undefined,
)
const eintragungshindernisFromEinrichtungForm: Ref<EintragungshindernisUngeplanteEinrichtung | undefined> = ref(
    model.value.eintragungshindernis instanceof EintragungshindernisUngeplanteEinrichtung
        ? model.value.eintragungshindernis
        : undefined,
)

watch([eintragungshindernisFromEinrichtungForm, eintragungshindernisFromPersonForm], () => {
    model.value.eintragungshindernis = eintragungshindernisFromPersonForm.value?.blocksSaving()
        ? eintragungshindernisFromPersonForm.value
        : eintragungshindernisFromEinrichtungForm.value ?? eintragungshindernisFromPersonForm.value
})

const emit = defineEmits<{
    cancelEditing: []
}>()
function close(): void {
    if (model.value) model.value.isEditMode = false
    emit('cancelEditing')
}
</script>

<template>
    <LehrtaetigkeitCardLayout :lehrtaetigkeit-form-model="model">
        <div class="q-gutter-md">
            <div class="flex items-center justify-between">
                <QToggle
                    v-model="model.isVertretung"
                    :label="uiTexts.IST_VERTRETUNG"
                    :data-testid="tags.DRAWER.LEHRTAETIGKEIT_FORM.IS_VERTRETUNG_TOGGLE"
                    size="xs"
                />
                <QBtn
                    round
                    flat
                    icon="close"
                    size="sm"
                    :data-testid="tags.DRAWER.LEHRTAETIGKEIT_FORM.CLOSE_EDIT_MODE"
                    @click="close"
                />
            </div>
            <PersonForm
                v-model:person="model.person"
                v-model:eintragungshindernis="eintragungshindernisFromPersonForm"
                :is-vertretung="model.isVertretung"
                :termin-id="model.terminId"
            />
            <EinrichtungForm
                v-model:einrichtung="model.einrichtung"
                v-model:eintragungshindernis="eintragungshindernisFromEinrichtungForm"
                :einrichtungs-optionen-ids="model.person?.einrichtungsIds"
            />
        </div>
    </LehrtaetigkeitCardLayout>
</template>
