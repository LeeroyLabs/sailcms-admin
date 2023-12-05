<template>
    <div class="tw-w-[525px] tw-h-[352px] tw-border tw-border-[#DADDE1]">
        <div class="tw-h-[275px] tw-max-h-[275px] tw-bg-black">
            <img :alt="title" :src="image" class="tw-max-h-[275px] tw-w-full tw-max-w-[525px]"/>
        </div>
        <div class="tw-h-[75px] tw-py-[10px] tw-px-[12px] tw-font-[Helvetica,Arial,sans-serif] tw-bg-[#F2F3F5]">
            <div class="tw-text-[#606770] tw-text-[12px] tw-uppercase tw-leading-[11px]">{{ domain }}</div>
            <div class="tw-text-[16px] tw-font-[600] tw-text-[#1d2129] tw-leading[20px] tw-break-words tw-truncate tw-text-ellipsis">{{ title }}</div>
            <div class="tw-text-[#606770] tw-mt-[3px] tw-text-[14px] tw-leading-[20px] tw-break-words tw-truncate tw-text-ellipsis">
                {{ description }}
            </div>
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