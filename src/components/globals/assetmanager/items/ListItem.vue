<template>
    <div
        class="tw-w-full tw-flex tw-flex-row tw-items-center tw-cursor-pointer tw-px-4 tw-py-2 tw-rounded-md"
        :class="{'hover:tw-bg-black/30': $vuetify.theme.name === 'dark', 'hover:tw-bg-gray-200': $vuetify.theme.name === 'light'}"
    >
        <div
            class="tw-bg-center tw-bg-cover tw-w-[40px] tw-h-[40px] tw-rounded-lg tw-mr-4"
            style="background-image: url(https://voxatl.org/wp-content/uploads/2019/04/avengers-endgame-poster-square-crop.jpg);"
        ></div>
        <div class="tw-w-full tw-flex tw-flex-col tw-gap-y-0.2">
            <h2 class="tw-font-medium tw-flex-grow">super-freaking-long-title-for-an-image-that-it-takes-all-the-space.webp</h2>
            <div
                class="tw-w-full tw-flex tw-flex-row"
                :class="{
                    'tw-text-gray-400': $vuetify.theme.name === 'dark',
                    'tw-text-gray-500': $vuetify.theme.name === 'light'
                }"
            >
                webp &mdash; 29KB
            </div>
        </div>
        <div>
            <v-icon icon="mdi-cloud-check-outline"/>
            <v-tooltip location="bottom" open-delay="1000" activator="parent">Available on cloud</v-tooltip>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>
