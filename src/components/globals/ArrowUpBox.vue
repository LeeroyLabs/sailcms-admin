<template>
    <div class="box" :class="{'tw-bg-white': $vuetify.theme.name === 'light', 'tw-bg-darkbg': $vuetify.theme.name === 'dark', 'tw-top-[80px]': offset, 'tw-top-[50px]': !offset}">
        <!-- Arrow -->
        <div class="arrow after:tw-border-t after:tw-border-l" :class="{ 'after:tw-border-neutral-400 after:tw-bg-white': $vuetify.theme.name === 'light', 'after:tw-border-gray-300 after:tw-bg-darkbg': $vuetify.theme.name === 'dark'}"></div>
        <div><slot name="extra"/></div>
        <div class="tw-block tw-w-full tw-max-h-[200px] tw-overflow-y-auto">
            <slot name="default"/>
        </div>
    </div>

</template>

<script setup>
const props = defineProps({
    offset: {
        type: Boolean,
        default: false
    }
});
</script>

<style>
.arrow::after {
    content: '';
    height: 10px;
    width: 10px;
    position: absolute;
    z-index: 9999;
    top: -6px;
    left: calc(50% - 5px);
    transform: rotate(45deg);
}

.box {
    @apply tw-absolute tw-inset-x-0 tw-z-[9999];
    @apply tw-p-4 tw-flex tw-flex-col tw-justify-center tw-border tw-border-neutral-400 tw-rounded-md;
}
</style>
