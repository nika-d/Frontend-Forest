<script setup lang="ts">
import { Person } from '$src/models/Person.js'
import { Option } from '$src/useCases/lehrendenEintragung/components/LehrtaetigkeitForm/PersonForm/Option'
import texts from '$src/common/uiTexts/texts.json'
import { Repository } from '$src/models/repository/common/Repository'
import { computed, ComputedRef, inject, Ref, ref } from 'vue'
import { QSelect, QItemSection, QItem, QItemLabel } from 'quasar'
import tags from '$test/data-testid-LEHRENDENEINTRAGUNG'
import uiTextsLE from '$src/common/uiTexts/lehrendenEintragung.json'
import { LehrtaetigkeitFormViewModel } from '$src/useCases/lehrendenEintragung/viewModel/LehrtaetigkeitFormViewModel'
import BadgesQualifikationen from '$src/useCases/lehrendenEintragung/components/LehrtaetigkeitForm/PersonForm/BadgesQualifikationen.vue'
import IconEintragungshindernis from '$src/useCases/lehrendenEintragung/components/LehrtaetigkeitForm/PersonForm/IconEintragungshindernis.vue'
import {
    computeOptionsByInput,
    createAllOptionsByNameAndMail,
    fetchEintragungshindernisseForOptions,
} from '$src/useCases/lehrendenEintragung/components/LehrtaetigkeitForm/PersonForm/helpers'
import { onFilter, onFilterDoneFn } from '$src/common/quasarTypes/onFilter'

const lehrtaetigkeitFormVM = defineModel<LehrtaetigkeitFormViewModel>({ required: true })

const props = defineProps<{ personenInAllenLehrtaetigkeitenDesTermins: Set<Person> }>()

const selectedOption: Ref<Option | undefined> = ref(
    lehrtaetigkeitFormVM.value.person ? new Option(lehrtaetigkeitFormVM.value.person) : undefined,
) as Ref<Option | undefined>

const qSelect: Ref<QSelect | undefined> = ref()

const allePersonen = (inject('personenRepo') as Ref<Repository<Person>>).value.all()

const allOptionsByNameAndMail: ComputedRef<Map<string, Option>> = computed(() => {
    if (lehrtaetigkeitFormVM.value.person) {
        return new Map()
    }
    return createAllOptionsByNameAndMail(
        allePersonen,
        props.personenInAllenLehrtaetigkeitenDesTermins,
        lehrtaetigkeitFormVM.value.person ?? undefined,
    )
})

const filteredOptions: Ref<Array<Option>> = ref([])

const doOptionFiltering: onFilter = (inputValue: string, update: onFilterDoneFn) => {
    update(
        async () => {
            filteredOptions.value = computeOptionsByInput(
                inputValue,
                allOptionsByNameAndMail.value,
                lehrtaetigkeitFormVM.value.person,
            )
            await fetchEintragungshindernisseForOptions(
                filteredOptions.value,
                lehrtaetigkeitFormVM.value.terminId,
                lehrtaetigkeitFormVM.value.isVertretung,
            )
        },

        function markFirstOptionForSelection(qSelectRef: QSelect) {
            qSelectRef.setOptionIndex(0)
        },
    )
}
function selectPerson(selectedOption: Option | undefined): void {
    lehrtaetigkeitFormVM.value.person = selectedOption?.person ?? null
    lehrtaetigkeitFormVM.value.eintragungshindernisFromApi = selectedOption?.eintragungshindernis ?? null
}
</script>

<template>
    <div :data-testid="tags.DRAWER.LEHRTAETIGKEIT_FORM.LEHRENDES">
        <QSelect
            ref="qSelect"
            v-model="selectedOption"
            :options="filteredOptions"
            :option-label="() => selectedOption?.person.vollerName"
            :use-input="!selectedOption"
            clearable
            class="bg-white"
            :label="uiTextsLE.LEHRENDE_R"
            @update:model-value="selectPerson"
            @filter="doOptionFiltering"
            @clear="qSelect?.hidePopup"
        >
            <template #option="scope: { opt: Option; itemProps: unknown }">
                <QItem v-bind="scope.itemProps">
                    <QItemSection>
                        <QItemLabel>
                            <IconEintragungshindernis :eintragungshindernis="scope.opt.eintragungshindernis" />
                            <strong>{{ scope.opt.person.vollerName }}</strong>
                        </QItemLabel>
                        <QItemLabel caption>
                            {{ scope.opt.person.email }}
                        </QItemLabel>
                    </QItemSection>
                    <QItemSection side class="flex q-gutter-xs">
                        <BadgesQualifikationen :qualifikationen="scope.opt.person.qualifikationen" />
                    </QItemSection>
                </QItem>
            </template>
            <template #no-option>
                <span v-if="!selectedOption" class="q-px-sm">{{ texts.KEIN_ERGEBNIS }}</span>
            </template>
        </QSelect>
    </div>
</template>
