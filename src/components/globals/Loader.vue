<template>
    <div class="tw-w-6/12 tw-flex tw-flex-row tw-items-center tw-mx-auto" :class="{'tw-h-screen': full}">
        <v-progress-linear color="primary" :indeterminate="true" :height="12" class="tw-mx-auto tw-mt-[-200px] tw-rounded-md"/>
    </div>
</template>

<script setup>
defineProps({
    full: {
        type: Boolean,
        default: true
    }
})
</script>
