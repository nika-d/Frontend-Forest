<script setup lang="ts">
import uiTexts from '$src/common/uiTexts/lehrendenEintragung.json'
import tags from '$test/data-testid-LEHRENDENEINTRAGUNG'
import LehrtaetigkeitCardLayout from '../LehrtaetigkeitCardLayout.vue'
import { Person } from '$src/models/Person'
import { LehrtaetigkeitFormViewModel } from '../../viewModel/LehrtaetigkeitFormViewModel'
import PersonForm from './PersonForm/PersonForm.vue'
import EinrichtungForm from './EinrichtungForm.vue'
import { QToggle, QBtn } from 'quasar'

const model = defineModel<LehrtaetigkeitFormViewModel>({ required: true })

defineProps<{ lehrendeInAllenForms: Set<Person> }>()

const emit = defineEmits<{
    cancelEditing: []
}>()
function close(): void {
    if (model.value) model.value.isEditMode = false
    emit('cancelEditing')
}
</script>

<template>
    <LehrtaetigkeitCardLayout :lehrtaetigkeit-form-v-m="model">
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

            <PersonForm v-model="model" :personen-in-allen-lehrtaetigkeiten-des-termins="lehrendeInAllenForms" />

            <EinrichtungForm v-model="model" />
        </div>
    </LehrtaetigkeitCardLayout>
</template>
