<template>
    <div v-if="isReady">
        <Teleport to="#actions">
            <v-btn @click="showGroupAdd=true" color="primary" v-if="hasPermission('readwrite_group')">
                {{ $t('usergroups.add') }}
            </v-btn>
        </Teleport>

        <div v-if="groups.length > 0" class="tw-mt-8 tw-flex tw-flex-row tw-flex-wrap tw-gap-6 tw-w-full">
            <v-card v-for="group in groups" variant="tonal" class="tw-group tw-relative tw-p-6 tw-flex tw-flex-row tw-items-center tw-justify-center tw-min-w-[225px] tw-min-h-[130px] tw-text-xl">
                {{ group.name }}
                <div class="tw-hidden group-hover:tw-flex tw-flex-row tw-items-center tw-justify-center tw-absolute tw-inset-0 bg-primary-darker-60">
                    <v-btn @click="editGroup(group)" variant="flat" icon color="primary" class="tw-mr-2">
                        <v-icon icon="mdi-pen"/>
                    </v-btn>
                    <v-btn @click="confirmDelete(group)" variant="flat" icon color="red">
                        <v-icon icon="mdi-trash-can"/>
                    </v-btn>
                </div>
            </v-card>
        </div>

        <div v-if="groups.length === 0" class="tw-text-2xl tw-w-full tw-text-center tw-mt-48">
            {{ $t('usergroups.no_groups') }}
        </div>
    </div>
    <Loader v-else/>

    <Transition>
        <DeleteConfirmation
            v-if="showDeleteConfirm"
            :show="true"
            :overall="true"
            :loading="isLoading"
            :title="$t('usergroups.confirm')"
            :message="$t('usergroups.confirm_delete', {group: (currentGroup) ? currentGroup.name : ''})"
            @cancel="showDeleteConfirm=false"
            @accept="deleteGroup"
        />
    </Transition>
</template>

<script setup>
import { usePage } from '@/libs/page';
import { ref } from 'vue';
import { hasPermission } from '@/libs/tools';
import { Groups } from '@/libs/graphql';
import Loader from '@/components/globals/Loader.vue';
import DeleteConfirmation from '@/components/globals/DeleteConfirmation.vue';

const page = usePage();
const isReady = ref(false);
const showGroupAdd = ref(false);
const showDeleteConfirm = ref(false);
const groups = ref([]);
const currentGroup = ref(null);
const isLoading = ref(false);

page.setPageTitle('usergroups.title');

const loadGroups = async () =>
{
    groups.value = await Groups.groups();
    isReady.value = true;
}

const confirmDelete = (group) =>
{
    currentGroup.value = group;
    showDeleteConfirm.value = true;
}

const deleteGroup = async () =>
{
    isLoading.value = true;

    await Groups.delete(currentGroup.value._id);
    await loadGroups();

    isLoading.value = false;
    showDeleteConfirm.value = false;
    currentGroup.value = null;
}

loadGroups();
</script>

<style lang="postcss">
.v-enter-active,
.v-leave-active {
    transition: opacity 0.35s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
