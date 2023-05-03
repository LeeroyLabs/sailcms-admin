<template>
    <v-dialog v-model="showing" persistent width="auto">
        <v-card rounded>
            <v-card-title class="text-h5 tw-my-4">
                <span class="tw-text-red-500">Fatal Error</span>
            </v-card-title>
            <v-card-text>
                {{ $t('system.errors.graphql') }}<br/>
                {{ $t('system.errors.graphql2')}}
                <span class="tw-bg-gray-200 tw-px-1 tw-py-1">conf.json</span>
                {{ $t('system.errors.graphql3')}}
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    }
});

const showing = computed(() =>
{
    return props.show;
})
</script>
