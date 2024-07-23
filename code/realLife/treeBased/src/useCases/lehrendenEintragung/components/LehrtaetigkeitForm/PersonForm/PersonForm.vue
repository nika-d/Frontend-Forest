<script setup lang="ts">
import texts from '$src/common/uiTexts/texts.json'
import { computed, ComputedRef, inject, Ref, ref, watch } from 'vue'
import { QSelect, QItemSection, QItem, QItemLabel } from 'quasar'
import tags from '$test/data-testid-LEHRENDENEINTRAGUNG'
import uiTextsLE from '$src/common/uiTexts/lehrendenEintragung.json'
import { Option } from '$src/useCases/lehrendenEintragung/components/LehrtaetigkeitForm/PersonForm/Option'
import BadgesQualifikationen from './BadgesQualifikationen.vue'
import { Person } from '$src/models/Person'
import { domainId } from '$src/models/common/domainId'
import IconEintragungshindernis from '$src/useCases/lehrendenEintragung/components/LehrtaetigkeitForm/PersonForm/IconEintragungshindernis.vue'
import { Eintragungshindernis } from '$src/useCases/lehrendenEintragung/models/Eintragungshindernis/Eintragungshindernis'
import { Repository } from '$src/models/repository/common/Repository'
import {
    computeOptionsByInput,
    createAllOptionsByNameAndMail,
    fetchEintragungshindernisse,
} from '$src/useCases/lehrendenEintragung/components/LehrtaetigkeitForm/PersonForm/helpers'
import { onFilter, onFilterDoneFn } from '$src/common/quasarTypes/onFilter'

const allePersonen = ((inject('personenRepo') as Ref<Repository<Person>>)?.value ?? new Repository<Person>()).all()
const personenInAllenLehrtaetigkeitenDesTermins =
    (inject('personenInAllenLehrtaetigkeitenDesTermins') as Ref<Set<Person>>)?.value ?? new Set<Person>()

const person = defineModel<Person>('person')
const eintragungshindernis = defineModel<Eintragungshindernis>('eintragungshindernis')

const props = defineProps<{ isVertretung: boolean; terminId: domainId }>()
const initialperson = person.value

const selectedOption = ref<Option | undefined>(initialperson ? new Option(initialperson) : undefined)

const qSelect: Ref<QSelect | undefined> = ref()

const allOptionsByNameAndMail: ComputedRef<Map<string, Option>> = computed(() =>
    createAllOptionsByNameAndMail(allePersonen, personenInAllenLehrtaetigkeitenDesTermins, initialperson),
)

const filteredOptions: Ref<Array<Option>> = ref([...allOptionsByNameAndMail.value.values()])

function setModelEintragungshindernis(newSelectedOption: Option | undefined = selectedOption.value as Option) {
    eintragungshindernis.value = newSelectedOption?.getEintragungshindernis(props.isVertretung)
}

watch(
    () => props.isVertretung,
    () => setModelEintragungshindernis(),
)

const doOptionFiltering: onFilter = (inputValue: string, update: onFilterDoneFn) => {
    update(
        async () => {
            filteredOptions.value = computeOptionsByInput(inputValue, allOptionsByNameAndMail.value, person.value)
            await fetchEintragungshindernisse(filteredOptions.value, props.terminId)
        },

        function markFirstOptionForSelection(qSelectRef: QSelect) {
            qSelectRef.setOptionIndex(0)
        },
    )
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
            @update:model-value="
                (newSelectedOption: Option | undefined) => {
                    person = newSelectedOption?.person
                    setModelEintragungshindernis(newSelectedOption)
                }
            "
            @filter="doOptionFiltering"
            @clear="qSelect?.hidePopup"
        >
            <template #option="scope: { opt: Option; itemProps: unknown }">
                <QItem v-bind="scope.itemProps">
                    <QItemSection>
                        <QItemLabel>
                            <IconEintragungshindernis
                                :eintragungshindernis="scope.opt.getEintragungshindernis(isVertretung)"
                            />
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
