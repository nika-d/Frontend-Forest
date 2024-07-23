<script setup lang="ts">
import { Einrichtung } from '$src/models/Einrichtung'
import { domainId } from '$src/models/common/domainId'
import { getArrayIntersection } from '$src/common/utils/arrayFunctions'
import uiTexts from '$src/common/uiTexts/lehrendenEintragung.json'
import tags from '$test/data-testid-LEHRENDENEINTRAGUNG'
import { computed, ComputedRef, inject, onUpdated, Ref, ref, watch } from 'vue'
import { QSelect } from 'quasar'
import { Repository } from '$src/models/repository/common/Repository'
import { EintragungshindernisUngeplanteEinrichtung } from '$src/useCases/lehrendenEintragung/models/Eintragungshindernis/EintragungshindernisUngeplanteEinrichtung'

const alleEinrichtungen =
    (inject('einrichtungenRepo') as Ref<Repository<Einrichtung>>)?.value ?? new Repository<Einrichtung>()
const geplanteEinrichtungen = (inject('geplanteEinrichtungenDesTermins') as Ref<Array<Einrichtung>>)?.value ?? []

const einrichtung = defineModel<Einrichtung>('einrichtung')
const eintragungshindernis = defineModel<EintragungshindernisUngeplanteEinrichtung>('eintragungshindernis')

const props = defineProps<{
    einrichtungsOptionenIds: Array<domainId>
}>()
const qSelect: Ref<QSelect | undefined> = ref()

const einrichtungsOptionen: ComputedRef<Array<Einrichtung> | null> = computed(() =>
    props.einrichtungsOptionenIds
        ? props.einrichtungsOptionenIds.map((id) => alleEinrichtungen.get(id) as Einrichtung)
        : null,
)

function autoselectEinrichtung() {
    if (!einrichtungsOptionen.value) einrichtung.value = undefined
    else {
        if (einrichtungsOptionen.value?.length === 1) {
            einrichtung.value = einrichtungsOptionen.value[0] as Einrichtung
        } else {
            const geplanteEinrichtungsIds = geplanteEinrichtungen.map((einrichtung) => einrichtung.id)
            const einrichtungsIdsInTerminGeplantUndInPerson = getArrayIntersection(
                props.einrichtungsOptionenIds ?? [],
                geplanteEinrichtungsIds,
            )
            if (einrichtungsIdsInTerminGeplantUndInPerson.length === 1)
                einrichtung.value = alleEinrichtungen!.get(einrichtungsIdsInTerminGeplantUndInPerson[0]) ?? undefined
        }
    }
}

function autoOpen() {
    if (!einrichtung.value) {
        qSelect.value?.showPopup()
    }
}
onUpdated(autoOpen)
watch(einrichtungsOptionen, autoselectEinrichtung)
</script>

<template>
    <QSelect
        ref="qSelect"
        v-model="einrichtung"
        :options="einrichtungsOptionen"
        option-label="bezeichnungGekuerzt"
        :label="uiTexts.EINRICHTUNGEN.EINRICHTUNG"
        :disable="!einrichtungsOptionen || einrichtungsOptionen?.length === 1"
        class="bg-white"
        :data-testid="tags.DRAWER.LEHRTAETIGKEIT_FORM.EINRICHTUNG"
        @update:model-value="
            (newEinrichtung) => {
                eintragungshindernis = geplanteEinrichtungen.find((geplant) => geplant == newEinrichtung)
                    ? undefined
                    : new EintragungshindernisUngeplanteEinrichtung()
            }
        "
    >
    </QSelect>
</template>
