<script setup lang="ts">
import LoadingPage from '$src/components/pages/LoadingPage.vue'
import { computed, ref } from 'vue'

const props = defineProps<{ loadingPromises: Promise<unknown>[] }>()
let loadedPromises = ref<number>(0)
let loadingAmount = computed(() => loadedPromises.value / props.loadingPromises.length)

for (const promise of props.loadingPromises) {
    promise.then(() => loadedPromises.value++)
}
</script>

<template>
    <LoadingPage v-if="loadingPromises.length" :loading-amount="loadingAmount" />
</template>
