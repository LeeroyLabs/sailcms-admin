<template>
    <div class="tw-relative">
        <div
            class="drag-handle tw-cursor-grab focus:tw-cursor-grabbing tw-absolute tw-border tw-border-zinc-400 tw-border-b-0 tw-top-[-28px] tw-flex tw-flex-row tw-items-center tw-justify-between tw-left-0 tw-text-black tw-py-1 tw-px-3 tw-rounded-t-lg tw-text-sm"
            :class="{'tw-bg-white': $vuetify.theme.name === 'light', 'tw-bg-neutral-900 tw-text-white': $vuetify.theme.name === 'dark'}"
        >
            {{ title }}
        </div>
        <div
            class="tw-absolute tw-top-[-26px] tw-right-0 tw-text-sm hover:tw-text-red-500 tw-cursor-pointer"
            :class="{'tw-text-neutral-600': $vuetify.theme.name === 'light', 'tw-text-neutral-400': $vuetify.theme.name === 'dark'}"
        >
            <v-icon icon="mdi-trash-can-outline"/>
        </div>
        <div
            class="tw-border tw-border-zinc-400 tw-rounded-tr-lg tw-rounded-b-lg tw-w-[290px] md:tw-w-[320px] lg:tw-w-[350px] tw-p-4"
            :class="{'tw-bg-white': $vuetify.theme.name === 'light', 'tw-bg-neutral-900 tw-text-white': $vuetify.theme.name === 'dark'}"
        >
            <ul class="tw-flex tw-flex-col tw-gap-3 tw-mb-3">
                <li class="tw-border tw-border-zinc-400 tw-py-2 tw-px-4">
                    Name of Field
                </li>
            </ul>
            <div class="tw-border tw-border-zinc-400 tw-py-2 tw-px-3 tw-cursor-pointer hover:tw-bg-primary hover:tw-text-white">
                <v-icon icon="mdi-plus"/>
                Add Field
            </div>
        </div>
    </div>
</template>

<script setup>

defineProps({
   title: {
       type: String,
       default: 'Unamed'
   }
});

</script>
