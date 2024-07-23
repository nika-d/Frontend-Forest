<script setup lang="ts">
import uiTexts from '$src/common/uiTexts/texts.json'
import tags from '$test/data-testid-COMPONENTS'
import { QBtn, QIcon } from 'quasar'
import { UserDisplayableError } from '$src/common/alerts/error/UserDisplayableError'

const props = defineProps<{ error: Error }>()
const error: Error = props.error

let header: string = ''
let body: string = ''
let link: string | null = null
let statusCode: number | null = null

if (error instanceof UserDisplayableError) {
    header = error.messageHeader
    body = error.messageBody
    link = error.link
    statusCode = error.statusCode
} else if (error) {
    header = uiTexts.ERROR_HEADING
    body = error.message
}
function reload() {
    document.location.reload()
}
</script>

<template>
    <div class="q-ml-lg q-pl-lg" :data-testid="tags.ERROR_PAGE">
        <div style="max-width: 40rem">
            <h3><QIcon name="error_outline" left color="negative" />{{ header }}</h3>
            <h5>{{ body }}</h5>
            <h5 v-if="link">
                <a :href="link" target="_blank">{{ link }}</a>
            </h5>
            <h5 v-if="statusCode">Code: {{ statusCode }}</h5>

            <QBtn size="xl" icon="refresh" :label="uiTexts.RELOAD" @click="reload" @keydown="reload" />
        </div>
    </div>
</template>
