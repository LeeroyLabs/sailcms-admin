<template>
    <div
        class="tw-flex tw-flex-row tw-items-center tw-gap-x-1.5 tw-p-3 tw-rounded-lg tw-cursor-pointer"
        :class="{
            'hover:tw-bg-slate-800': $vuetify.theme.name === 'dark' && !active,
            'hover:tw-bg-gray-300': $vuetify.theme.name === 'light' && !active,
            'tw-bg-slate-800': $vuetify.theme.name === 'dark' && active,
            'tw-bg-gray-300': $vuetify.theme.name === 'light' && active
        }"
    >
        <v-icon icon="mdi-folder-outline"></v-icon>
        {{ formattedName }}
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
    name: {
        type: String,
        default: ''
    },
    slug: {
        type: String,
        default: ''
    },
    active: {
        type: Boolean,
        default: false
    }
});

const formattedName = computed(() => props.name.charAt(0).toUpperCase() + props.name.slice(1));
</script>
