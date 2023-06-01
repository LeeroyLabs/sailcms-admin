<template>
    <v-overlay :persistent="true" :model-value="true" class="tw-fixed tw-z-[9999] tw-inset-0 tw-flex tw-flex-row tw-items-center tw-justify-center">
        <v-card class="tw-p-6 tw-max-w-[450px]">
            <v-card-title class="tw-mb-4">{{ isAdding ? $t('usergroups.add_a_group') : $t('usergroups.edit_group') }}</v-card-title>
            <v-card-text>
                <v-text-field
                    class="tw-w-[300px] lg:tw-w-[330px] tw-my-2"
                    density="comfortable"
                    variant="outlined"
                    color="primary"
                    :placeholder="$t('usergroups.group_name')"
                    rounded
                    :hide-details="true"
                    v-model="groupName"
                />
            </v-card-text>
            <v-card-actions class="tw-flex tw-flex-row tw-justify-end">
                <v-btn @click.prevent="cancelGroup" variant="flat">{{ $t('system.cancel') }}</v-btn>
                <v-btn @click.prevent="addGroup" :loading="isLoading" variant="flat" color="primary">{{ isAdding ? $t('system.add') : $t('system.save') }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-overlay>
</template>

<script setup>

import { ref } from 'vue';

const emitter = defineEmits(['cancel', 'add'])

const props = defineProps({
    isAdding: {
        type: Boolean,
        default: true
    },
    isLoading: {
        type: Boolean,
        default: false
    },
    group: {
        type: Object,
        default: null
    }
});

const groupName = ref((props.group) ? props.group.name : '');

const cancelGroup = () =>
{
    if (props.isLoading) return;
    emitter('cancel');
}

const addGroup = () =>
{
    if (props.isLoading) return;
    emitter('add', groupName.value);
}

</script>
