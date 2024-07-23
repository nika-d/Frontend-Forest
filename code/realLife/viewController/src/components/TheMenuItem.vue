<script setup lang="ts">
defineProps({
    title: { type: String, required: true },
    link: { type: String, default: '#' },
    icon: { type: String, default: '' },
})
</script>

<template>
    <q-item clickable tag="a" :href="link">
        <q-item-section v-if="icon" avatar>
            <q-icon :name="icon" color="primary" />
            <q-tooltip>
                {{ title }}
            </q-tooltip>
        </q-item-section>

        <q-item-section>
            <q-item-label>{{ title }}</q-item-label>
        </q-item-section>
    </q-item>
</template>
