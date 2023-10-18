<template>
    <div>
        <div v-if="robotsAllowed" class="preview tw-p-4 tw-w-[600px] tw-bg-white tw-rounded-md" :class="{'tw-border tw-border-neutral-300': $vuetify.theme.name === 'light'}">
            <div class="tw-font-[arial, sans-serif] tw-w-[600px]">
                <div class="tw-max-w-[575px] tw-overflow-hidden tw-text-[#1a0dab] tw-text-[18px] tw-font-[400] tw-leading-[1.2] tw-whitespace-nowrap tw-truncate tw-text-ellipsis">
                    {{ title }} - SITENAME
                </div>
                <div class="tw-h-[18px] tw-text-[#006620] tw-text-[14px] tw-leading-[16px] tw-whitespace-nowrap tw-overflow-hidden tw-text-ellipsis tw-truncate">
                    {{ formattedURL }}
                </div>
                <div class="tw-text-[#545454] tw-text-[13px] tw-leading-[1.4] tw-break-words tw-overflow-ellipsis tw-pr-6">
                    <template v-if="description.trim() === ''">
                        {{ $t('serp.no_description') }}.
                    </template>
                    <template v-else>
                        {{ description }}
                    </template>
                </div>
            </div>
        </div>
        <div v-else class="tw-text-sm tw-font-medium" :class="{'tw-text-red-500': $vuetify.theme.name === 'dark', 'tw-text-red-700': $vuetify.theme.name === 'light'}">
            {{ $t('serp.robots_warning') }}
        </div>
    </div>
</template>

<script setup>

import { useAppStore } from '@/store/app';
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps({
    title: {
        type: String,
        default: 'SITE'
    },
    url: {
        type: String,
        default: '/'
    },
    description: {
        type: String,
        default: 'Nothing to say!'
    },
    urlPrefix: {
        type: String,
        default: ''
    },
    robotsAllowed: {
        type: Boolean,
        default: true
    }
});

const store = useAppStore();
const publicURL = ref('');

const formattedURL = computed(() =>
{
    let url = publicURL.value + '/' + props.urlPrefix + '/' + props.url;
    return url.replace(/\/\//g, '/');
})

onMounted(() =>
{
    publicURL.value = window.publicURL;
});

</script>