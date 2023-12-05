<template>

    <div class="tw-w-[516px] tw-h-[131px] tw-border tw-border-[#CFD9DE] tw-rounded-lg tw-bg-white tw-flex tw-flex-row">
        <div class="tw-h-[129px] tw-min-w-[129px] tw-w-[129px] tw-border-r tw-border-[#E7ECEE] tw-rounded-l-lg tw-bg-black tw-flex tw-flex-row tw-items-center">
            <img :src="image" :alt="title" width="129" class="tw-rounded-l-lg tw-max-w-[129px] tw-w-full"/>
        </div>
        <div class="tw-px-2.5 tw-py-5">
            <div class="tw-text-[#536471] tw-text-[15px] tw-font-[400] tw-leading-[20px]">{{ domain }}</div>
            <div class="tw-text-[#0f1419] tw-text-[15px] tw-font-[400] tw-leading-[20px] tw-break-words tw-truncate tw-text-ellipsis">{{ title }}</div>
            <div class="tw-text-[15px] tw-font-[400] tw-leading-[20px] tw-max-w-[385px] tw-text-[#536471] tw-break-words tw-overflow-ellipsis">{{ trimmed(description) }}</div>
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

const trimmed = (text) =>
{
    if (text.length > 118) {
        return text.substring(0, 115) + '...';
    }

    return text;
}

</script>