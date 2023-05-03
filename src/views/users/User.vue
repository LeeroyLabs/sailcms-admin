<template>
    <div v-if="isReady" class="tw-border tw-border-red-500 tw-mx-3 tw-flex tw-flex-row">
        <div class="tw-group tw-w-32 tw-h-32 tw-rounded-full tw-bg-black tw-relative">
            <div class="tw-cursor-pointer tw-absolute tw-rounded-full tw-h-full tw-w-full tw-bg-black/50 tw-hidden group-hover:tw-flex tw-flex-row tw-items-center tw-justify-center">
                <v-icon icon="mdi-camera" color="white"/>
            </div>
            <img v-if="currentUser.avatar !== ''" :src="currentUser.avatar" alt="" class="tw-rounded-full"/>
        </div>
    </div>
    <Loader v-else/>
</template>

<script setup lang="ts">

import { useAppStore } from "@/store/app";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import Loader from "@/components/globals/Loader.vue";
import { ref } from "vue";
import { Users } from "@/libs/graphql";
import type { User } from "@/libs/graphql/types/users";

const store = useAppStore();
const i18n = useI18n();
const route = useRoute();
const router = useRouter();

const isReady = ref(false);
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

    currentUser.value = user as User;
    setupPage(currentUser.value.name.full);
    isReady.value = true;
}

setupPage();

if (route.params.id !== 'add') loadUser();
if (route.params.id === 'add') isReady.value = true;
</script>
