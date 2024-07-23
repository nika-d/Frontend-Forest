<script setup lang="ts">
import uiTexts from '$src/common/uiTexts/texts.json'
import tags from '$test/data-testid-COMPONENTS'
import { QLayout, QPage, QPageContainer, QCircularProgress } from 'quasar'

const props = defineProps<{ loadingAmount: number }>()
</script>

<template>
    <QLayout>
        <QPageContainer>
            <QPage
                class="home-page window-height window-width row justify-center items-center"
                :data-testid="tags.LOADING_PAGE"
            >
                <div class="row justify-center items-center">
                    <div class="content-lg-center">
                        <QCircularProgress
                            show-value
                            rounded
                            :value="props.loadingAmount"
                            :max="1"
                            size="15rem"
                            color="primary"
                            class="q-ma-md"
                            font-size="2rem"
                        >
                            {{ uiTexts.LOADING }}
                        </QCircularProgress>
                    </div>
                </div>
            </QPage>
        </QPageContainer>
    </QLayout>
</template>
