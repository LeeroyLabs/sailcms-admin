<template>
    <th>
        <div class="tw-flex tw-flex-row tw-items-center">
            {{ text }}
            <v-btn v-if="sortable" variant="flat" class="tw-ml-2" size="x-small" icon @click.prevent="$emit('sort')">
                <v-icon :icon="(ascending) ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon>
            </v-btn>
            <div v-if="sortable" :class="{'tw-invisible': condition}" class="tw-ml-2">
                <v-progress-circular indeterminate  size="x-small" :width="3" />
            </div>
        </div>
    </th>
</template>

<script setup lang="ts">
defineProps({
    text: {
        type: String,
        default: ''
    },
    sortable: {
        type: Boolean,
        default: true
    },
    showLoaderOnSort: {
        type: Boolean,
        default: false
    },
    condition: {
        type: Boolean,
        default: false
    },
    ascending: {
        type: Boolean,
        default: false
    }
});
</script>
