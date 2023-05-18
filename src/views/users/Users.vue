<template>
    <div v-if="!isLoading">
        <Teleport to="#actions">
            <v-btn @click="$router.push({name: 'SingleUser', params: {id: 'add'}})" color="primary" v-if="hasPermission('readwrite_user')">
                {{ $t('users.add') }}
            </v-btn>
        </Teleport>
        <section class="tw-mt-6 tw-mb-4 tw-flex tw-flex-col-reverse md:tw-flex-row tw-justify-between">
            <div class="tw-flex tw-flex-row tw-w-full lg:tw-w-3/12 tw-items-center" v-if="hasPermission('readwrite_user')">
                <v-select
                    v-if="hasPermission('readwrite_user')"
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
                ></v-select>

                <v-btn
                    v-if="hasPermission('readwrite_user')"
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
            <div v-else></div>

            <div class="tw-w-full tw-mb-4 md:tw-mb-0 lg:tw-w-4/12 tw-flex tw-flex-row tw-gap-x-4 tw-items-center">
                <v-progress-circular :class="{'!tw-invisible': !isLoadingSearch, '!tw-hidden': $vuetify.display.mobile}" indeterminate size="small" width="3"/>
                <v-text-field
                    color="primary"
                    :label="$t('users.search')"
                    variant="outlined"
                    :hide-details="true"
                    type="text"
                    clearable
                    density="comfortable"
                    v-model="currentSearch"
                    @keydown.enter="runSearch"
                    @click:clear="clearSearch"
                >
                    <template v-slot:append-inner>
                        <div class="tw-opacity-[0.20]">
                            <v-icon icon="mdi-keyboard-return"/>
                        </div>
                    </template>
                </v-text-field>
            </div>
        </section>

        <v-table class="utable">
            <thead>
                <tr>
                    <th class="!tw-min-w-[4px] !tw-max-w-[4px]">
                        <v-checkbox @change="handleCheckAll" color="primary" value="checkall" hide-details></v-checkbox>
                    </th>
                    <SmartTH
                        :text="$t('users.columns.name')"
                        :sortable="true"
                        @sort="setSorting('name.full')"
                        :showLoaderOnSort="true"
                        :condition="currentSorting !== 'name.full' || !isLoadingSort"
                        :ascending="(currentSorting === 'name.full' && currentSortingDir === 'ASC')"
                    />
                    <SmartTH
                        :text="$t('users.columns.email')"
                        :sortable="true"
                        @sort="setSorting('email')"
                        :showLoaderOnSort="true"
                        :condition="currentSorting !== 'email' || !isLoadingSort"
                        :ascending="(currentSorting === 'email' && currentSortingDir === 'ASC')"
                    />
                    <th class="!tw-text-center">
                        {{ $t('users.columns.tfa') }}
                    </th>
                    <th class="!tw-text-center">
                        {{ $t('users.columns.isadmin') }}
                    </th>
                    <th class="!tw-text-center">
                        {{ $t('users.columns.status') }}
                    </th>
                    <SmartTH
                        :text="$t('users.columns.created_at')"
                        :sortable="true"
                        @sort="setSorting('created_at')"
                        :showLoaderOnSort="true"
                        :condition="currentSorting !== 'created_at' || !isLoadingSort"
                        :ascending="(currentSorting === 'created_at' && currentSortingDir === 'ASC')"
                    />
                </tr>
            </thead>
            <tbody>
                <tr v-for="(user, idx) in userListing" :key="user.id">
                    <td class="!tw-min-w-[4px] !tw-max-w-[4px]">
                        <v-checkbox v-if="levelIsHigher(user)" v-model="selectedUsers" color="primary" :value="user" hide-details></v-checkbox>
                    </td>
                    <td>
                        <router-link
                            v-if="levelIsHigher(user)"
                            class="hover:tw-text-primary hover:tw-underline"
                            :class="{'hover:tw-text-white': ($vuetify.theme.name !== 'light')}"
                            :to="{name: 'SingleUser', params: {id: user._id}}"
                        >
                            {{ user.name.full }}
                        </router-link>
                        <span v-else>{{ user.name.full }}</span>
                    </td>
                    <td>{{ user.email }}</td>
                    <td class="tw-text-center">
                        <v-icon color="green" v-if="user.meta.flags.use2fa" icon="mdi-check"/>
                        <v-icon color="red" v-else icon="mdi-close"/>
                    </td>
                    <td class="tw-text-center">
                        <v-icon color="green" v-if="isAdmin(user)" icon="mdi-check"/>
                        <v-icon color="red" v-else icon="mdi-close"/>
                    </td>
                    <td class="tw-text-center">
                        <v-icon color="green" v-if="user.status" icon="mdi-check"/>
                        <v-icon color="red" v-else icon="mdi-close"/>
                    </td>
                    <td v-html="format(user.created_at * 1000, 'dd-MM-yyyy')"></td>
                </tr>
                <tr v-if="userListing.length === 0">
                    <td colspan="7" class="tw-text-center tw-font-medium">{{ $t('users.no_users') }}</td>
                </tr>
            </tbody>
        </v-table>

        <Pagination class="tw-mt-6" :limit="currentLimit" :pagination="pagination"/>

        <Transition>
            <DeleteConfirmation
                v-if="showDeleteConfirm"
                :show="true"
                :overall="true"
                title="Confirm"
                :loading="applyingAction"
                message="Are you sure you want to delete ?"
                @cancel="showDeleteConfirm=false"
                @accept="confirmDelete"
            />
        </Transition>
    </div>
    <Loader v-else />
</template>

<script setup>
import { useAppStore } from "@/store/app";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import Loader from "@/components/globals/Loader.vue";
import { Users } from "@/libs/graphql";
import { format } from "date-fns";
import Pagination from "@/components/globals/Pagination.vue";
import SmartTH from "@/components/globals/table/SmartTH.vue";
import { isAdmin, hasPermission } from "@/libs/tools";
import DeleteConfirmation from '@/components/globals/DeleteConfirmation.vue';

const i18n = useI18n();
const store = useAppStore();
const users = ref([]);
const pagination = ref({total: 0, current: 0, totalPages: 0});
const isLoading = ref(true);
const applyingAction = ref(false);

// Search
const currentSearch = ref('');

// Pagination handling
const currentPage = ref(1);
const currentLimit = ref(25);
const selectedUsers = ref([]);

// Sorting
const currentSorting = ref('name.full');
const currentSortingDir = ref('ASC');
const isLoadingSort = ref(false);

// Search loader
const isLoadingSearch = ref(false);

// Actions
const selectedAction = ref(null);
const showDeleteConfirm = ref(false);
const availableActions = computed(() =>
{
    return [
        {value: 'disable', title: i18n.t('users.actions.disable')},
        {value: 'enable', title: i18n.t('users.actions.enable')},
        {value: 'delete', title: i18n.t('users.actions.delete')},
    ];
});

// Filter out the anonymous user (used for anonymous things and testing)
const userListing = computed(() =>
{
    return users.value.filter(u => u.email !== 'anonymous@mail.io');
});

// Update some things when locale changes
watch(i18n.locale, () =>
{
    setupPage();
});

const levelIsHigher = (user) =>
{
    let level = store.currentUser.highest_level;
    return user.highest_level <= level;
};

// Setup page data
const setupPage = () =>
{
    // Set Breadcrumb
    store.setBreadcrumbs([
        {title: 'Dashboard', disabled: false, to: store.baseURL + '/dashboard'},
        {title: i18n.t('users.title')}
    ]);

    store.setPageTitle(i18n.t('users.title'));
    document.title = i18n.t('users.title') + ' — SailCMS'
}

// Load users
const loadUsers = async () =>
{
    const meta = `
        flags {
            use2fa
        }
    `;

    let result = await Users.users({
        page: currentPage.value,
        limit: currentLimit.value,
        search: currentSearch.value,
        sorting: {
            sort: currentSorting.value,
            order: currentSortingDir.value
        }
    }, meta);

    users.value = result.list;
    pagination.value = result.pagination;
    isLoading.value = false;
}

// Handle the "Check All" checkbox
const handleCheckAll = (e) =>
{
    if (e.target.checked) selectedUsers.value = users.value;
    if (!e.target.checked) selectedUsers.value = [];
}

// Sorting from the Table
const setSorting = async (field) =>
{
    if (isLoadingSort.value) return;

    if (currentSorting.value !== field) {
        currentSorting.value = field;
        currentSortingDir.value = 'ASC';
    } else {
        currentSortingDir.value = (currentSortingDir.value === 'ASC') ? 'DESC' : 'ASC';
    }

    isLoadingSort.value = true;
    await loadUsers();
    isLoadingSort.value = false;
}

// Run Search
const runSearch = async (e) =>
{
    isLoadingSearch.value = true;
    currentPage.value = 1;
    currentSorting.value = 'name.full';
    currentSortingDir.value = 'ASC';
    await loadUsers();
    isLoadingSearch.value = false;
}

// Clear Search Button Handler
const clearSearch = async () =>
{
    isLoadingSearch.value = true;
    currentSearch.value = '';
    currentPage.value = 1;
    currentSorting.value = 'name.full';
    currentSortingDir.value = 'ASC';
    await loadUsers();
    isLoadingSearch.value = false;
}

const performAction = async () =>
{
    if (selectedAction.value === 'delete') {
        showDeleteConfirm.value = true;
        return;
    }

    if (applyingAction.value) return;

    applyingAction.value = true;

    let action = selectedAction.value;
    let users = selectedUsers.value;

    const userIds = users.map(u => u._id);

    switch (action)
    {
        default:
        case 'enable':
            await Users.enableUsers(userIds);
            break;

        case 'disable':
            await Users.disableUsers(userIds);
            break;
    }

    await loadUsers();
    applyingAction.value = false;
    selectedAction.value = null;
    selectedUsers.value = [];
}

const confirmDelete = async () =>
{
    if (applyingAction.value) return;

    applyingAction.value = true;
    let users = selectedUsers.value;

    const userIds = users.map(u => u._id);
    await Users.deleteUsers(userIds);

    await loadUsers();
    applyingAction.value = false;
    showDeleteConfirm.value = false;
    selectedAction.value = null;
    selectedUsers.value = [];
}
setupPage();
loadUsers();
</script>

<style lang="postcss">
.utable tr:hover td {
    background-color: rgba(229, 231, 235, 0.20);
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.35s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
