<template>
    <div class="tw-w-full tw-flex tw-flex-row">
        <div
            v-for="(tab, idx) in tabs"
            @click="$emit('change', idx)"
            class="tab"
            :class="{
                'tw-px-4': !stretch,
                'tw-w-full': stretch,
                'tw-text-sm': smallText,
                'tw-bg-white hover:tw-bg-white/70 tw-font-medium tw-text-primary': $vuetify.theme.name === 'light' && active === idx,
                'tw-font-medium tw-text-primary tw-bg-darkbg': $vuetify.theme.name === 'dark' && active === idx,
                'hover:tw-bg-gray-300': $vuetify.theme.name === 'light' && active !== idx,
                'hover:tw-bg-neutral-900': $vuetify.theme.name === 'dark' && active !== idx
            }"
        >
                {{ tab }}
        </div>
    </div>
</template>

<script setup>
defineProps({
    tabs: {
        type: Array,
        default: []
    },
    active: {
        type: Number,
        default: 0
    },
    stretch: {
        type: Boolean,
        default: true
    },
    smallText: {
        type: Boolean,
        default: false
    }
});

defineEmits(['change']);
</script>


<style lang="postcss">
.tab {
    @apply tw-text-center tw-uppercase tw-py-3 tw-rounded-t-md tw-cursor-pointer;
}
</style>
