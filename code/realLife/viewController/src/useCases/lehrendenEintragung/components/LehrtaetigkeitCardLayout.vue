<script setup lang="ts">
import tags from '../../../../test/data-testid-LEHRENDENEINTRAGUNG'
import { QCard, QCardSection, QItem, QItemSection, QIcon } from 'quasar'
import { LehrtaetigkeitFormViewModel } from '$src/useCases/lehrendenEintragung/viewModel/LehrtaetigkeitFormViewModel'
import termineColors from './termine.module.scss'
import { colors as quasarColors } from 'quasar'

const props = defineProps<{ lehrtaetigkeitFormVM: LehrtaetigkeitFormViewModel }>()
</script>

<template>
    <QCard
        class="lehrtaetigkeit-card-layout bg-grey-2"
        :style="{
            borderColor: props.lehrtaetigkeitFormVM.isMarkedToBeDeleted
                ? termineColors.deletedColor
                : props.lehrtaetigkeitFormVM.eintragungshindernis
                  ? quasarColors.getPaletteColor(props.lehrtaetigkeitFormVM.eintragungshindernis.toAlert().iconColor)
                  : props.lehrtaetigkeitFormVM.isVertretung
                    ? termineColors.vertretungColor
                    : termineColors.lehrenderColor,
        }"
        :bordered="
            !!props.lehrtaetigkeitFormVM.eintragungshindernis // bordered muss boolean sein sonst gibt es Warnungen in der Konsole
        "
        :data-testid="tags.DRAWER.VERTRETUNGSINDICATOR"
    >
        <QCardSection
            :class="{ 'text-grey': lehrtaetigkeitFormVM.isMarkedToBeDeleted }"
            :data-testid="tags.DRAWER.LEHRTAETIGKEIT"
        >
            <slot />
        </QCardSection>
        <QItem
            v-if="props.lehrtaetigkeitFormVM.eintragungshindernis"
            :data-testid="tags.DRAWER.LEHRTAETIGKEIT_FORM.EINTRAGUNGSHINDERNIS"
            class="q-pt-none"
        >
            <QItemSection avatar style="min-width: 0">
                <QIcon
                    :name="props.lehrtaetigkeitFormVM.eintragungshindernis?.toAlert().iconName"
                    :color="props.lehrtaetigkeitFormVM.eintragungshindernis?.toAlert().iconColor"
                    size="sm"
                />
            </QItemSection>
            <QItemSection>
                {{ lehrtaetigkeitFormVM.eintragungshindernis?.toAlert().messageMain }}
            </QItemSection>
        </QItem>
    </QCard>
</template>

<style scoped lang="scss">
.lehrtaetigkeit-card-layout {
    border-left-width: 0.5rem;
    border-left-style: solid;

    &:hover .action-buttons {
        display: block;
    }
}
</style>
