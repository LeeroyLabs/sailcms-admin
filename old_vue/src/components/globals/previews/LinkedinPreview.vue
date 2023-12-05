<template>
    <div class="tw-w-[520px] tw-h-[334px] tw-border tw-border-[#C9C9C9]">
        <div class="tw-h-[270px] tw-bg-black">
            <img :alt="title" :src="image" height="270" class="tw-max-h-[270px] tw-h-[270px] tw-w-full tw-max-w-[520px]"/>
        </div>
        <div class="tw-h-[62px] tw-py-[10px] tw-px-[12px] tw-font-[-apple-system,system-ui,BlinkMacSystemFont,Roboto,Helvetica,Arial,sans-serif] tw-bg-white">
            <div class="tw-text-[16px] tw-font-[600] tw-text-[#1d2129] tw-leading[24px] tw-break-words tw-truncate tw-text-ellipsis">{{ title }}</div>
            <div class="tw-text-black/60 tw-text-[12px] tw-leading-[16px] tw-font-[400]">{{ domain }}</div>
        </div>
    </div>
</template>

<script setup>

import { onMounted, ref } from 'vue';

defineProps({
    title: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    }
});

const domain = ref('');

onMounted(() =>
{
    domain.value = window.publicURL.replace('https://', '')
        .replace('www.', '')
        .replace(/\//g, '');
});

</script>