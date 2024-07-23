<script setup lang="ts">
import { QIcon, QTooltip } from 'quasar'
import { Eintragungshindernis } from '$src/useCases/lehrendenEintragung/models/Eintragungshindernis/Eintragungshindernis'

defineProps<{ eintragungshindernis: Eintragungshindernis | undefined }>()
</script>

<template>
    <QIcon
        v-if="eintragungshindernis"
        :name="eintragungshindernis?.toAlert().iconName"
        :color="eintragungshindernis?.toAlert().iconColor"
        size="xs"
        class="q-mr-sm"
    >
        <QTooltip>{{ eintragungshindernis?.toAlert().messageMain }}</QTooltip>
    </QIcon>
</template>
