<template>
    <div v-if="isReady">
        <BackButton :url="{name: 'Settings'}"/>
        <Teleport to="#actions">
            <v-btn @click="$router.push({name: 'EntryType', params: {id: 'add'}})" color="primary" v-if="hasPermission('readwrite_entry_type')">
                {{ $t('entry_types.add') }}
            </v-btn>
        </Teleport>

        <div v-if="types.length > 0" class="tw-mt-8 tw-flex tw-flex-row tw-flex-wrap tw-gap-6 tw-w-full">
            <v-card v-for="type in types" variant="tonal" class="tw-group tw-relative tw-p-6 tw-flex tw-flex-row tw-items-center tw-justify-center tw-min-w-[225px] tw-min-h-[130px] tw-text-xl">
                {{ type.title }}
                <div class="tw-hidden group-hover:tw-flex tw-flex-row tw-items-center tw-justify-center tw-absolute tw-inset-0 tw-bg-black/40">
                    <v-btn @click="$router.push({name: 'EntryType', params: {id: type.handle}})" variant="flat" icon color="primary" class="tw-mr-2">
                        <v-icon icon="mdi-pen"/>
                    </v-btn>
                    <v-btn v-if="type.handle !== 'page'" @click="confirmDelete(type)" variant="flat" icon color="red">
                        <v-icon icon="mdi-trash-can"/>
                    </v-btn>
                </div>
            </v-card>
        </div>

        <div v-if="types.length === 0" class="tw-text-2xl tw-w-full tw-text-center tw-mt-48">
            {{ $t('entry_types.no_types') }}
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
            :message="$t('entry_types.delete_confirm', {name: (currentType) ? currentType.title : ''})"
            @cancel="showDeleteConfirm=false"
            @accept="deleteType"
        />
    </Transition>
</template>

<script setup>
import { usePage } from '@/libs/page';
import { hasPermission } from '@/libs/tools';
import Loader from '@/components/globals/Loader.vue';
import DeleteConfirmation from '@/components/globals/DeleteConfirmation.vue';
import { SailCMS } from '@/libs/graphql';
import { ref } from 'vue';
import { Entries } from '@/libs/graphql/lib/entries';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/store/app';
import { useI18n } from 'vue-i18n';
import BackButton from '@/components/globals/BackButton.vue';

const isReady = ref(false);
const showDeleteConfirm = ref(false);
const types = ref([]);
const currentType = ref(null);
const isLoading = ref(false);

const router = useRouter();
const store = useAppStore();
const page = usePage();
const i18n = useI18n();

page.setPageTitle('entry_types.title');

const loadTypes = async () =>
{
    types.value = await Entries.entryTypes(SailCMS.getLocales());
    isReady.value = true;
}

const confirmDelete = (group) =>
{
    currentType.value = group;
    showDeleteConfirm.value = true;
}

const deleteType = async () =>
{
    if (isLoading.value) return;

    isLoading.value = true;
    let result = await Entries.deleteEntryType(currentType.value._id);

    if (result) {
        loadTypes();

        store.displayToast('success', i18n.t('entry_types.delete_success'));
        showDeleteConfirm.value = false;
        isLoading.value = false;
        window.location.reload();
    } else {
        store.displayToast('error', i18n.t('entry_types.delete_fail'));
        isLoading.value = false;
    }
}

if (!hasPermission('readwrite_entry_type')) {
    router.push({name: 'Settings'});
}

loadTypes();
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
