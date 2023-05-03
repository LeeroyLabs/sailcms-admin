<template>
    <div v-if="!isLoading">
        <Teleport to="#actions">
            <v-btn @click="$router.push({name: 'SingleUser', params: {id: 'add'}})" color="primary" prepend-icon="mdi-account-plus" v-if="hasPermission('readwrite_user')">
                Add User
            </v-btn>
        </Teleport>
        <section class="tw-mt-6 tw-mb-4 tw-flex tw-flex-col-reverse md:tw-flex-row tw-justify-between">
            <div class="tw-flex tw-flex-row tw-w-full lg:tw-w-3/12 tw-items-center">
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
                >
                    <v-icon icon="mdi-chevron-right"/>
                </v-btn>
            </div>

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
                        <v-checkbox v-model="selectedUsers" color="primary" :value="user" hide-details></v-checkbox>
                    </td>
                    <td>
                        <router-link
                            class="hover:tw-text-primary hover:tw-underline"
                            :class="{'hover:tw-text-white': ($vuetify.theme.name !== 'light')}"
                            :to="{name: 'SingleUser', params: {id: user._id}}"
                        >
                            {{ user.name.full }}
                        </router-link>
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
                    <td colspan="6" class="tw-text-center tw-font-medium">{{ $t('users.no_users') }}</td>
                </tr>
            </tbody>
        </v-table>

        <Pagination class="tw-mt-6" :limit="currentLimit" :pagination="pagination"/>
    </div>
    <Loader v-else />
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import Loader from "@/components/globals/Loader.vue";
import { Users } from "@/libs/graphql";
import type { User } from "@/libs/graphql/types/users";
import { format } from "date-fns";
import Pagination from "@/components/globals/Pagination.vue";
import SmartTH from "@/components/globals/table/SmartTH.vue";
import { isAdmin, hasPermission } from "@/libs/tools";

const i18n = useI18n();
const store = useAppStore();
const users = ref([]);
const pagination = ref({total: 0, current: 0, totalPages: 0});
const isLoading = ref(true);

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
const availableActions = computed(() =>
{
    return [
        i18n.t('users.actions.disable'),
        i18n.t('users.actions.delete'),
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

    users.value = result.list as User[];
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
const setSorting = async (field: string) =>
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

setupPage();
loadUsers();
</script>

<style lang="postcss">
    .utable tr:hover td {
        background-color: rgba(229, 231, 235, 0.20);
    }
</style>
