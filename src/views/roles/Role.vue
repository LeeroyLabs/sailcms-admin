<template>
    <div v-if="isReady" class="tw-p-6 tw-w-full md:tw-w-10/12 lg:tw-w-8/12 xl:tw-w-8/12 2xl:tw-w-7/12 tw-ml-0">
        <v-form ref="form">
            <v-text-field
                color="primary"
                :label="$t('role.name')"
                variant="outlined"
                type="email"
                :rules="[rules.required]"
                validate-on="blur"
                v-model="currentRole.name"
                density="comfortable"
                class="tw-mb-2"
            />
            <v-textarea
                color="primary"
                :label="$t('role.description')"
                variant="outlined"
                type="text"
                :row="3"
                :rules="[rules.required]"
                validate-on="blur"
                v-model="currentRole.description"
                density="comfortable"
                class="tw-mb-2"
            />
            <div class="tw-flex tw-flex-row tw-items-start tw-justify-between">
                <v-slider
                    :label="$t('role.level')"
                    class="tw-mt-0.5"
                    v-model="currentRole.level"
                    :min="100"
                    :max="900"
                    :step="50"
                    :thumb-size="24"
                    show-ticks="always"
                    thumb-label
                />
                <div class="tw-border tw-rounded-md tw-p-2">{{ currentRole.level }}</div>
            </div>
        </v-form>
    </div>
    <div v-if="isReady" class="tw-p-6 tw-pt-0 tw-w-full md:tw-w-12/12 lg:tw-w-11/12 xl:tw-w-10/12 2xl:tw-w-10/12 tw-ml-0">
        <label class="tw-block tw-mb-6 tw-text-xl">Permissions</label>
        <div class="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-y-4">
            <div class="tw-min-w-[255px]" v-for="(perms, key) in permissions" :key="key">
                <v-radio-group v-model="rolePermissions[key]">
                    <strong>{{ niceName(key) }}</strong>
                    <v-radio
                        v-for="(perm, idx) in perms"
                        :key="key"
                        :label="perm.description[$i18n.locale]"
                        color="primary"
                        :value="perm.name"
                        hide-details
                    />
                    <v-radio
                        :label="$t('role.no_permission')"
                        color="primary"
                        value="none"
                        hide-details
                    />
                </v-radio-group>
            </div>
        </div>
    </div>
    <div v-if="isReady" class="tw-pl-5">
        <v-btn :loading="isSaving" @click.prevent="saveRole" variant="flat" color="primary">
            {{ (isAdding) ? $t('role.add') : $t('role.save') }}
        </v-btn>
    </div>

    <Loader v-if="!isReady"/>
</template>

<script setup>
import { usePage } from '@/libs/page';
import { useRoute, useRouter } from 'vue-router';
import { computed, nextTick, onMounted, ref } from 'vue';
import { Roles } from '@/libs/graphql';
import { useI18n } from 'vue-i18n';
import Loader from '@/components/globals/Loader.vue';
import { sortBy } from 'lodash';
import { useAppStore } from '@/store/app';

const route = useRoute();
const router = useRouter();
const page = usePage();
const i18n = useI18n();
const store = useAppStore();

const isReady = ref(false);
const permissions = ref([]);
const rolePermissions = ref({});
const form = ref(null);

const isSaving = ref(false);
const isAdding = ref(false);

const currentRole = ref({
    _id: '',
    name: '',
    slug: '',
    description: '',
    permissions: [],
    level: 100
});

const rules = {
    required: value => !!value || i18n.t('login.errors.required'),
}

page.setBreadcrumbs([{title: 'roles.title', disable: true, to: ''}]);

const loadPermission = async () =>
{
    const perms = await Roles.permissions();
    let formatted = {};

    for (let perm of perms) {
        if (!formatted[perm.group]) {
            formatted[perm.group] = [];
        }

        formatted[perm.group].push(perm);
    }

    // Clean up the result (sort permissions)
    let keys = Object.keys(formatted);

    for (let key of keys) {
        formatted[key] = sortBy(formatted[key], ['description' + i18n.locale]);
    }

    // Sort group keys
    let final = {};
    keys = sortBy(keys);

    for (let key of keys) {
        final[key] = formatted[key];
        rolePermissions.value[key] = 'none';
    }

    permissions.value = final;

    if (isAdding.value) {
        isReady.value = true;
    }
}

const loadRole = async () =>
{
    let role = await Roles.role(route.params.id)

    currentRole.value = role.role;

    let keys = Object.keys(rolePermissions.value);

    for (let key of keys) {
        for (let perm of currentRole.value.permissions) {
            let [type, cat] = perm.split('_');

            if (key === cat) {
                rolePermissions.value[key] = perm;
            }
        }
    }

    isReady.value = true;
}

const niceName = (key) =>
{
    return permissions.value[key][0].unnormalized_name;
}

const saveRole = async () =>
{
    if (isSaving.value) return;

    const status = await form.value.validate();

    if (!status.valid) {
        document.querySelector('#mainSection > div').scrollTo({top: 0, behavior: 'smooth'});
        return;
    }

    isSaving.value = true;

    // Build permission array
    let keys = Object.keys(rolePermissions.value);
    let perms = [];

    for (let key of keys) {
        if (rolePermissions.value[key] !== 'none') {
            perms.push(rolePermissions.value[key]);
        }
    }

    currentRole.value.permissions = perms;
    let response;

    if (isAdding.value) {
        response = await Roles.createRole(currentRole.value);
    } else {
        response = await Roles.updateRole(route.params.id, currentRole.value);
    }

    if (response) {
        isSaving.value = false;
        await router.push({name: 'Roles'});
        store.displayToast('success', i18n.t('role.save_success'));
    } else {
        store.displayToast('error', i18n.t('role.save_error'))
    }

    isSaving.value = false;
}

if (route.params.id === 'add') {
    isAdding.value = true;
    page.setPageTitle('role.add');
    rolePermissions.value = [];
    loadPermission();
} else {
    isAdding.value = false;
    page.setPageTitle('role.edit');
    loadPermission().then(() =>
    {
        loadRole();
    });
}
</script>
