<template>
    <div v-if="isReady">
        <BackButton :url="{name: 'Settings'}"/>
        <Teleport to="#actions">
            <v-btn @click="$router.push({name: 'SingleEntryField', params: {key: 'new'}})" color="primary" v-if="hasPermission('readwrite_entryfields')">
                {{ $t('fields.add') }}
            </v-btn>
        </Teleport>
        <section class="tw-mt-6 tw-mb-4 tw-flex tw-flex-col-reverse md:tw-flex-row tw-justify-between">
            <div class="tw-flex tw-flex-row tw-w-full lg:tw-w-full tw-justify-between tw-items-center" v-if="hasPermission('readwrite_entryfields')">
                <div class="tw-flex tw-flex-row tw-items-center tw-w-4/12">
                    <v-select
                        v-model="selectedAction"
                        label="Actions"
                        color="primary"
                        :items="availableActions"
                        variant="outlined"
                        density="comfortable"
                        single-line
                        placeholder="Actions"
                        :persistent-hint="false"
                        :hide-details="true"
                    />

                    <v-btn
                        v-if="selectedFields.length > 0 && hasPermission('readwrite_entryfields')"
                        :class="{
                            'tw-invisible tw-opacity-0': selectedAction === null,
                            'tw-opacity-100': selectedAction !== null
                        }"
                        class="!tw-hidden md:!tw-block tw-ml-2 tw-transition-opacity tw-duration-300"
                        color="primary"
                        size="small"
                        icon
                        @click.prevent="performAction"
                    >
                        <v-icon icon="mdi-chevron-right"/>
                    </v-btn>

                    <v-progress-circular indeterminate size="x-small" width="2" class="tw-ml-2" :class="{'tw-invisible': !applyingAction}"/>
                </div>
                <div>
                    SEARCH
                </div>
            </div>
            <div v-else></div>
        </section>

        <v-table class="utable">
            <thead>
            <tr>
                <th>
                    <v-checkbox @change="handleCheckAll" color="primary" value="checkall" hide-details></v-checkbox>
                </th>

                <th class="tw-w-[25%]">
                    {{ $t('fields.columns.name') }}
                </th>
                <th class="tw-w-[20%]">
                    {{ $t('fields.columns.key') }}
                </th>
                <th class="tw-w-[20%]">
                    {{ $t('fields.columns.type') }}
                </th>
                <th class="!tw-text-center">
                    {{ $t('fields.columns.repeatable') }}
                </th>
                <th class="!tw-text-center">
                    {{ $t('fields.columns.required') }}
                </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(field, idx) in fieldListing" :key="field._id">
                <td>
                    <v-checkbox v-model="selectedFields" color="primary" :value="field" hide-details></v-checkbox>
                </td>
                <td>
                    <router-link
                        class="hover:tw-text-primary hover:tw-underline"
                        :class="{'hover:tw-text-white': ($vuetify.theme.name !== 'light')}"
                        :to="{name: 'SingleEntryField', params: {key: field.key}}"
                    >
                        {{ field.name }}
                    </router-link>
                </td>
                <td>{{ field.key }}</td>
                <td>{{ $t('fields.types.' + field.type) }}</td>
                <td class="tw-text-center">
                    <v-icon color="green" v-if="field.repeatable" icon="mdi-check"/>
                    <v-icon color="red" v-else icon="mdi-close"/>
                </td>
                <td class="tw-text-center">
                    <v-icon color="green" v-if="field.required" icon="mdi-check"/>
                    <v-icon color="red" v-else icon="mdi-close"/>
                </td>
            </tr>
            <tr v-if="fieldListing.length === 0">
                <td colspan="7" class="tw-text-center tw-font-medium">{{ $t('fields.no_fields') }}</td>
            </tr>
            </tbody>
        </v-table>
        <!-- Spacer -->
        <div class="tw-h-[30px]"></div>

        <Transition>
            <DeleteConfirmation
                v-if="showDeleteConfirm"
                :show="true"
                :overall="true"
                :title="$t('users.confirm')"
                :loading="isDeleting"
                :message="(selectedFields.length > 1) ? $t('fields.confirm_delete_many') : $t('fields.confirm_delete')"
                @cancel="showDeleteConfirm=false"
                @accept="confirmDelete"
            />
        </Transition>
    </div>
    <Loader v-else />
</template>

<script setup>

import { hasPermission, isAdmin } from '@/libs/tools';
import { format } from 'date-fns';
import DeleteConfirmation from '@/components/globals/DeleteConfirmation.vue';
import Loader from '@/components/globals/Loader.vue';
import Pagination from '@/components/globals/Pagination.vue';
import { ref } from 'vue';
import { Entries } from '@/libs/graphql/lib/entries';
import { usePage } from '@/libs/page';
import { useI18n } from 'vue-i18n';
import BackButton from '@/components/globals/BackButton.vue';
import { useAppStore } from '@/store/app';

const page = usePage();
const i18n = useI18n();
const store = useAppStore();

const isReady = ref(false);
const showDeleteConfirm = ref(false);
const fieldListing = ref([]);
const selectedFields = ref([]);
const selectedAction = ref(null);
const applyingAction = ref(false);
const isDeleting = ref(false);

const availableActions = ref([
    {value: 'delete', title: i18n.t('system.delete')}
]);

const handleCheckAll = (e) =>
{
    if (e.target.checked) selectedFields.value = fieldListing.value;
    if (!e.target.checked) selectedFields.value = [];
}

const loadFields = async () =>
{
    fieldListing.value = await Entries.fields();
    isReady.value = true;
}

const performAction = async () => showDeleteConfirm.value = true;

const confirmDelete = async () =>
{
    let list = [];

    for (let field of selectedFields.value) {
        list.push(field._id);
    }

    isDeleting.value = true;
    let result = await Entries.deleteEntryFields(list);
    isDeleting.value = false;

    if (result) {
        store.displayToast(
            'success',
            (list.length > 1) ? i18n.t('fields.delete_success_many') : i18n.t('fields.delete_success')
        );

        await loadFields();
        showDeleteConfirm.value = false;
    } else {
        store.displayToast(
            'error',
            (list.length > 1) ? i18n.t('fields.delete_error_many') : i18n.t('fields.delete_error')
        );
    }
}

page.setPageTitle('fields.title')

loadFields();
</script>
