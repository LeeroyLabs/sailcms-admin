<template>
    <div class="tw-flex tw-flex-row tw-sticky tw-top-0 tw-w-full tw-items-center">
        <div class="tw-w-6/12 tw-p-4">
            {{ $t('pagination.showing', {offset: firstRecord, limit: lastRecord, total: pagination.total}) }}
        </div>
        <div class="tw-w-6/12 tw-flex tw-flex-row tw-justify-end">
            <v-pagination
                v-model="pagination.current"
                :length="pagination.totalPages"
                :total-visible="5"
                active-color="primary"
            />
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
    pagination: {
        type: Object,
        default: {current: 0, totalPages: 0, total: 0}
    },
    limit: {
        type: Number,
        default: 25
    }
});

const firstRecord = computed(() =>
{
    const first = (props.pagination?.current * props.limit) - props.limit + 1;
    if (props.pagination.total === 0) return 0;
    return first;
});

const lastRecord = computed(() =>
{
    if (props.pagination?.current * props.limit > props.pagination.total) return props.pagination.total;
    return props.pagination?.current * props.limit;
});
</script>
