<template>
    <v-card :elevation="$vuetify.theme.name === 'light' ? 2 : 4" v-if="isReady" class="tw-p-6 tw-w-full md:tw-w-10/12 lg:tw-w-8/12 xl:tw-w-8/12 2xl:tw-w-7/12 tw-ml-0 ">
        <div class="tw-mx-3 tw-flex tw-flex-col md:tw-flex-row">
            <div class="tw-group tw-w-32 tw-h-32 tw-rounded-full tw-bg-black tw-relative tw-mx-auto md:tw-mx-0 tw-bg-center tw-bg-cover" :style="'background-image: url(' + currentUser.avatar + ');'">
                <div @click="selectFile" class="tw-cursor-pointer tw-absolute tw-rounded-full tw-h-full tw-w-full tw-bg-black/50 tw-hidden group-hover:tw-flex tw-flex-row tw-items-center tw-justify-center">
                    <v-icon icon="mdi-camera" color="white"/>
                </div>
            </div>
            <v-form ref="form" class="tw-flex-grow">
                <div class="md:tw-ml-6 tw-mt-6 md:tw-mt-0">
                    <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-x-4 tw-mb-4 tw-gap-y-4 md:tw-gap-y-0">
                        <v-text-field
                            color="primary"
                            :label="$t('user.firstname')"
                            variant="outlined"
                            type="text"
                            :rules="[rules.required]"
                            validate-on="blur"
                            v-model="currentUser.name.first"
                            density="comfortable"
                        />
                        <v-text-field
                            color="primary"
                            :label="$t('user.lastname')"
                            variant="outlined"
                            type="text"
                            :rules="[rules.required]"
                            validate-on="blur"
                            v-model="currentUser.name.last"
                            density="comfortable"
                        />
                    </div>

                    <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-x-4 tw-mb-4 tw-gap-y-4 md:tw-gap-y-0">
                        <v-text-field
                            color="primary"
                            :label="$t('user.email')"
                            variant="outlined"
                            type="text"
                            :rules="[rules.required, rules.email]"
                            validate-on="blur"
                            v-model="currentUser.email"
                            density="comfortable"
                            autocomplete="new-password"
                        />
                        <v-select
                            v-model="selectedGroup"
                            :label="$t('user.group')"
                            color="primary"
                            :items="availableGroups"
                            variant="outlined"
                            density="comfortable"
                            single-line
                            :no-data-text="$t('user.no_groups')"
                            :placeholder="$t('user.group')"
                        ></v-select>
                    </div>

                    <div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-x-4 tw-mb-4 tw-gap-y-4 md:tw-gap-y-0">
                        <v-select
                            v-model="currentUser.roles"
                            :label="$t('user.roles')"
                            color="primary"
                            :items="availableRoles"
                            variant="outlined"
                            :rules="[rules.atLeastOne]"
                            validate-on="blur"
                            density="comfortable"
                            single-line
                            :placeholder="$t('user.roles')"
                            chips
                            multiple
                        ></v-select>
                    </div>

                    <div v-if="!forceReset" class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-x-4">
                        <v-text-field
                            color="primary"
                            :label="$t('user.password')"
                            variant="outlined"
                            type="password"
                            validate-on="blur"
                            :rules="[rules.requiredIfSetting]"
                            v-model="currentUser.password"
                            density="comfortable"
                            autocomplete="new-password"
                        />
                        <v-text-field
                            color="primary"
                            :label="$t('user.passconf')"
                            variant="outlined"
                            type="password"
                            :rules="[rules.requiredIfSetting, rules.matchPassword]"
                            validate-on="blur"
                            v-model="confpass"
                            density="comfortable"
                            autocomplete="new-password"
                        />
                    </div>
                    <div v-if="isAdding" class="tw-flex tw-flex-col md:tw-flex-row tw-mb-4">
                        <v-checkbox v-model="forceReset" color="primary" density="comfortable" :label="$t('user.force_reset')"/>
                    </div>
                </div>
                <div class="tw-ml-6 tw-gap-x-3 tw-flex">
                    <v-btn :loading="isLoading" @click.prevent="saveUser" color="primary">
                        <template v-if="isAdding">{{ $t('user.add') }}</template>
                        <template v-else>{{ $t('user.save') }}</template>
                    </v-btn>

                    <v-btn @click.prevent="$router.push({name: 'Users'})" color="text">
                        {{ $t('user.cancel') }}
                    </v-btn>
                </div>
            </v-form>
        </div>
    </v-card>
    <Loader v-else/>

    <Transition>
    <AssetManager v-if="showAM" :multi="false" :cropping="cropping" @close="showAM=false" @selected="handleSelectedAsset" />
    </Transition>
</template>

<script setup>

import { useAppStore } from "@/store/app";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import Loader from "@/components/globals/Loader.vue";
import { ref } from "vue";
import { Roles, Users, Groups } from "@/libs/graphql";
import { EmailRule } from "@/libs/validation";
import AssetManager from "@/components/globals/AssetManager.vue";

const store = useAppStore();
const i18n = useI18n();
const route = useRoute();
const router = useRouter();

const showAM = ref(false);
const form = ref(null);

// Fields that are not necessarily sent
const confpass = ref('');
const forceReset = ref(false);

const selectedGroup = ref(null);
const availableGroups = ref([]);
const availableRoles = ref([]);

const isReady = ref(false);
const isAdding = ref(true);
const isLoading = ref(false);

const cropping = {
    name: 'avatar',
    ratio: 0,
    min: {
        width: 200,
        height: 200
    },
    max: {
        width: 800,
        height: 800
    },
    lockedType: 'circle'
};

// User base
const currentUser = ref({
    name: {
        first: '',
        last: ''
    },
    password: '',
    avatar: '',
    email: '',
    roles: [],
    locale: '',
});

const rules = {
    required: value => !!value || i18n.t('user.errors.required'),
    atLeastOne: value => value.length > 0 || i18n.t('user.errors.at_least_one'),
    email: value => EmailRule.test(value) || i18n.t('user.errors.email'),
    requiredIfSetting: value => {
        if (forceReset.value) {
            return true;
        }

        if (!isAdding.value) {
            return true;
        }

        return !!value || i18n.t('user.errors.required')
    },
    matchPassword: value => value === currentUser.value.password || i18n.t('user.errors.password_match')
};

// Save
const saveUser = async () =>
{
    if (isLoading.value) return;
    const status = await form.value.validate();
    if (!status) return;

    isLoading.value = true;

    let id = '';

    if (isAdding.value) {
        id = await Users.createUser(currentUser.value, forceReset.value);
    } else {
        let success = await Users.updateUser(route.params.id, currentUser.value);
        id = (success === 'false') ? '' : success;
    }

    isLoading.value = false;

    if (id === 'email-used') {
        store.displayToast('error', i18n.t('user.errors.email_exists'));
        return;
    } else if (id === 'weak-password') {
        store.displayToast('error', i18n.t('user.errors.weak_password'));
        return;
    } else if (id === 'invalid-email') {
        store.displayToast('error', i18n.t('user.errors.invalid_email'));
        return;
    } else if (id === '') {
        store.displayToast('error', i18n.t('user.errors.unknown_error'));
        return;
    }

    // Show success
    store.displayToast('success', i18n.t('user.save_success', {
        user: currentUser.value.name.first + ' ' + currentUser.value.name.last
    }));

    await router.push(store.baseURL + '/users');
}

// Setup page data
const setupPage = (name = '') =>
{
    const bc = [
        {title: 'Dashboard', to: store.baseURL + '/dashboard'},
        {title: i18n.t('users.title'), to: '/users', disabled: false},
    ];

    if (route.params.id === 'add') {
        bc.push({title: i18n.t('user.adding'), disabled: true, to: ''});
    } else {
        bc.push({title: name, disabled: true, to: ''});
    }

    // Set Breadcrumb
    store.setBreadcrumbs(bc);

    if (route.params.id === 'add') {
        store.setPageTitle(i18n.t('users.title'));
        document.title = i18n.t('users.title') + ' — SailCMS'
    } else {
        store.setPageTitle(name);
        document.title = name + ' — SailCMS'
    }
}

// Load User data
const loadUser = async () =>
{
    const meta = `
        flags {
            use2fa
        }
    `;

    let user = await Users.user(route.params.id, meta);

    if (user.highest_level > store.currentUser.highest_level) {
        // You are not allowed here, out!
        user = null;
    }

    if (!user) {
        await router.push(store.baseURL + '/users');
        return;
    }

    await loadLists();

    currentUser.value = user;
    currentUser.value.password = '';
    setupPage(currentUser.value.name.full);
    isReady.value = true;
    isAdding.value = false;
}

const selectFile = () => showAM.value = true;

const handleSelectedAsset = (files) =>
{
    // Hide Asset Manager
    showAM.value = false;

    // Default to full size url
    let url = files[0].url;

    // Find the Avatar crop (if any)
    for (let transform of files[0].transforms) {
        if (transform.transform === 'avatar') {
            url = transform.url;
        }
    }

    currentUser.value.avatar = url;
}

// Load list of dropdowns (roles and groups)
const loadLists = async () =>
{
    // Load Groups and Roles
    const results = await Promise.allSettled([
        Roles.roles(),
        Groups.groups()
    ]);

    const roles = results[0].value;
    availableRoles.value = [];

    roles.forEach((role) =>
    {
        availableRoles.value.push({value: role.slug, title: role.name});
    });

    availableGroups.value = results[1].value;
}

setupPage();

if (route.params.id !== 'add') loadUser();
if (route.params.id === 'add') {
    loadLists().then(() =>
    {
        isReady.value = true;
    });
}
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.35s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
