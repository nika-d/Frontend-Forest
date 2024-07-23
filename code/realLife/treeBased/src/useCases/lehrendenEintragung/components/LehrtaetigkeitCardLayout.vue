<script setup lang="ts">
import tags from '../../../../test/data-testid-LEHRENDENEINTRAGUNG'
import { QCard, QCardSection, QItem, QItemSection, QIcon } from 'quasar'
import termineColors from './termine.module.scss'
import { colors as quasarColors } from 'quasar'
import { LehrtaetigkeitFormModel } from '$src/useCases/lehrendenEintragung/viewModel/LehrtaetigkeitFormModel'

const props = defineProps<{ lehrtaetigkeitFormModel: LehrtaetigkeitFormModel }>()
</script>

<template>
    <QCard
        class="lehrtaetigkeit-card-layout bg-grey-2"
        :style="{
            borderColor: props.lehrtaetigkeitFormModel.isMarkedToBeDeleted
                ? termineColors.deletedColor
                : props.lehrtaetigkeitFormModel.eintragungshindernis
                  ? quasarColors.getPaletteColor(props.lehrtaetigkeitFormModel.eintragungshindernis.toAlert().iconColor)
                  : props.lehrtaetigkeitFormModel.isVertretung
                    ? termineColors.vertretungColor
                    : termineColors.lehrenderColor,
        }"
        :bordered="
            !!props.lehrtaetigkeitFormModel.eintragungshindernis // bordered muss boolean sein sonst gibt es Warnungen in der Konsole
        "
        :data-testid="tags.DRAWER.VERTRETUNGSINDICATOR"
    >
        <QCardSection
            :class="{ 'text-grey': lehrtaetigkeitFormModel.isMarkedToBeDeleted }"
            :data-testid="tags.DRAWER.LEHRTAETIGKEIT"
        >
            <slot />
        </QCardSection>
        <QItem
            v-if="props.lehrtaetigkeitFormModel.eintragungshindernis"
            :data-testid="tags.DRAWER.LEHRTAETIGKEIT_FORM.EINTRAGUNGSHINDERNIS"
            class="q-pt-none"
        >
            <QItemSection avatar style="min-width: 0">
                <QIcon
                    :name="props.lehrtaetigkeitFormModel.eintragungshindernis?.toAlert().iconName"
                    :color="props.lehrtaetigkeitFormModel.eintragungshindernis?.toAlert().iconColor"
                    size="sm"
                />
            </QItemSection>
            <QItemSection>
                {{ lehrtaetigkeitFormModel.eintragungshindernis?.toAlert().messageMain }}
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
