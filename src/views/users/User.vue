<template>
    <v-card :elevation="$vuetify.theme.name === 'light' ? 2 : 4" v-if="isReady" class="tw-p-6 tw-w-full md:tw-w-10/12 lg:tw-w-8/12 xl:tw-w-8/12 2xl:tw-w-7/12 tw-ml-0 ">
        <div class="tw-mx-3 tw-flex tw-flex-col md:tw-flex-row">
            <div class="tw-group tw-w-32 tw-h-32 tw-rounded-full tw-bg-black tw-relative tw-mx-auto md:tw-mx-0 tw-bg-center tw-bg-cover" :style="'background-image: url(' + currentUser.avatar + ');'">
                <div @click="selectFile" class="tw-cursor-pointer tw-absolute tw-rounded-full tw-h-full tw-w-full tw-bg-black/50 tw-hidden group-hover:tw-flex tw-flex-row tw-items-center tw-justify-center">
                    <v-icon icon="mdi-camera" color="white"/>
                </div>
            </div>
            <v-form class="tw-flex-grow">
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
                            :rules="[rules.required]"
                            validate-on="blur"
                            density="comfortable"
                            single-line
                            placeholder="$t('user.roles')"
                            chips
                            multiple
                        ></v-select>
                    </div>

                    <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-x-4">
                        <v-text-field
                            color="primary"
                            :label="$t('user.password')"
                            variant="outlined"
                            type="password"
                            :rules="[rules.required]"
                            validate-on="blur"
                            v-model="password"
                            density="comfortable"
                        />
                        <v-text-field
                            color="primary"
                            :label="$t('user.passconf')"
                            variant="outlined"
                            type="password"
                            :rules="[rules.required]"
                            validate-on="blur"
                            v-model="confpass"
                            density="comfortable"
                        />
                    </div>
                    <div class="tw-flex tw-flex-col md:tw-flex-row tw-mb-4">
                        <v-checkbox v-model="forceReset" color="primary" density="comfortable" :label="$t('user.force_reset')"/>
                    </div>
                </div>
                <div class="tw-ml-6 tw-gap-x-3 tw-flex">
                    <v-btn @click="$router.push({name: 'SingleUser', params: {id: 'add'}})" color="primary" prepend-icon="mdi-content-save-outline">
                        <template v-if="isAdding">{{ $t('user.add') }}</template>
                        <template v-else>{{ $t('user.save') }}</template>
                    </v-btn>

                    <v-btn @click="$router.push({name: 'Users'})" color="text" prepend-icon="mdi-close">
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

<script setup lang="ts">

import { useAppStore } from "@/store/app";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import Loader from "@/components/globals/Loader.vue";
import { ref } from "vue";
import { Roles, Users, Groups } from "@/libs/graphql";
import type { User } from "@/libs/graphql/types/users";
import { EmailRule } from "@/libs/validation";
import { Group } from "@/libs/graphql/types/groups";
import { Role } from "@/libs/graphql/types/roles";
import AssetManager from "@/components/globals/AssetManager.vue";

const store = useAppStore();
const i18n = useI18n();
const route = useRoute();
const router = useRouter();

const showAM = ref(false);

// Fields that are not necessarily sent
const password = ref('');
const confpass = ref('');
const forceReset = ref(false);

const selectedGroup = ref(null);
const availableGroups = ref([] as Group[]);
const availableRoles = ref([] as any[]);

const isReady = ref(false);
const isAdding = ref(true);
const isImageLoading = ref(false);

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
        last: '',
        full: '',
        slug: ''
    },
    avatar: '',
    email: '',
    roles: [],
    status: true
} as User);

const rules = {
    required: value => !!value || i18n.t('user.errors.required'),
    email: value => {
        return EmailRule.test(value) || i18n.t('user.errors.email')
    }
};

// Setup page data
const setupPage = (name: string = '') =>
{
    const bc = [
        {title: 'Dashboard', to: store.baseURL + '/dashboard'},
        {title: 'Users', to: '/users', disabled: false},
    ] as any;

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

    const user = await Users.user(route.params.id as string, meta);

    if (!user) {
        await router.push(store.baseURL + '/users');
        return;
    }

    await loadLists();

    currentUser.value = user as User;
    setupPage(currentUser.value.name.full);
    isReady.value = true;
    isAdding.value = false;
}

const selectFile = () => {
    console.log("HERE?");
    showAM.value = true;
}

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

    const roles = results[0].value as Role[];
    availableRoles.value = [] as any[];

    roles.forEach((role) =>
    {
        availableRoles.value.push({value: role._id, title: role.name});

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
