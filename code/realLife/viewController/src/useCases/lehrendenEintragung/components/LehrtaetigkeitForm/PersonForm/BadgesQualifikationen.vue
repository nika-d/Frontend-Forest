<script setup lang="ts">
import { QBadge } from 'quasar'

defineProps<{ qualifikationen: Array<string> }>()
</script>

<template>
    <QBadge
        v-for="qualifikation in qualifikationen"
        :key="qualifikation"
        outline
        color="grey-6"
        :label="qualifikation"
    />
</template>
