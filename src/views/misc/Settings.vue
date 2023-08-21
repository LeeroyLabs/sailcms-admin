<template>
    <v-card class="tw-p-6" v-if="isReady">
        <div class="tw-flex tw-flex-row tw-items-center tw-mb-2">
            <h1 class="tw-mr-4 tw-text-xl">{{ $t('system.system') }}</h1>
            <v-divider class="border-opacity-75"></v-divider>
        </div>
        <div class="tw-flex tw-flex-row tw-flex-wrap tw-gap-6">
            <div class="tw-flex tw-flex-col tw-items-center" v-if="hasPermission('readwrite_group')">
                <v-btn @click.prevent="$router.push({ name: 'UserGroups' })" icon size="x-large" variant="flat">
                    <v-icon icon="mdi-account-group-outline" size="42"/>
                </v-btn>
                <div class="tw-text-center tw-mt-2">{{ $t('usergroups.title') }}</div>
            </div>
            <div class="tw-flex tw-flex-col tw-items-center" v-if="hasPermission('readwrite_role')">
                <v-btn @click.prevent="$router.push({ name: 'Roles' })" icon size="x-large" variant="flat">
                    <v-icon icon="mdi-account-tie-hat-outline" size="42"/>
                </v-btn>
                <div class="tw-text-center tw-mt-2">{{ $t('roles.title') }}</div>
            </div>
            <div class="tw-flex tw-flex-col tw-items-center" v-if="hasPermission('readwrite_user')">
                <v-btn @click.prevent="$router.push({name: 'Users'})" icon size="x-large" variant="flat">
                    <v-icon icon="mdi-account-outline" size="42"/>
                </v-btn>
                <div class="tw-text-center tw-mt-2">{{ $t('users.title') }}</div>
            </div>
            <div class="tw-flex tw-flex-col tw-items-center" v-if="hasPermission('any')">
                <v-btn @click.prevent="$router.push({name: 'Emails'})" icon size="x-large" variant="flat">
                    <v-icon icon="mdi-email-outline" size="42"/>
                </v-btn>
                <div class="tw-text-center tw-mt-2">{{ $t('system.email_templates') }}</div>
            </div>
        </div>

        <div class="tw-flex tw-flex-row tw-items-center tw-mt-8 tw-mb-2">
            <h1 class="tw-mr-4 tw-text-xl">{{ $t('system.content') }}</h1>
            <v-divider class="border-opacity-75"></v-divider>
        </div>
        <div class="tw-flex tw-flex-row tw-flex-wrap tw-gap-6">
            <div class="tw-flex tw-flex-col tw-items-center" v-if="hasPermission('readwrite_entry_type')">
                <v-btn @click.prevent="$router.push({name: 'EntryTypes'})" icon size="x-large" variant="flat">
                    <v-icon icon="mdi-shape-plus-outline" size="42"/>
                </v-btn>
                <div class="tw-text-center tw-mt-2">{{ $t('system.entry_types') }}</div>
            </div>
            <div class="tw-flex tw-flex-col tw-items-center" v-if="hasPermission('readwrite_entry_fields')">
                <v-btn @click.prevent="$router.push({name: 'EntryFields'})" icon size="x-large" variant="flat">
                    <v-icon icon="mdi-form-textbox" size="42"/>
                </v-btn>
                <div class="tw-text-center tw-mt-2">{{ $t('system.entry_fields') }}</div>
            </div>
            <div class="tw-flex tw-flex-col tw-items-center" v-if="hasPermission('readwrite_entry_layout')">
                <v-btn @click.prevent="$router.push({name: 'EntryLayouts'})" icon size="x-large" variant="flat">
                    <v-icon icon="mdi-order-alphabetical-ascending" size="42"/>
                </v-btn>
                <div class="tw-text-center tw-mt-2">{{ $t('system.entry_layouts') }}</div>
            </div>
            <div class="tw-flex tw-flex-col tw-items-center" v-if="hasPermission('readwrite_asset')">
                <v-btn @click.prevent="$router.push({name: 'Assets'})" icon size="x-large" variant="flat">
                    <v-icon icon="mdi-image-outline" size="42"/>
                </v-btn>
                <div class="tw-text-center tw-mt-2">{{ $t('assets.title') }}</div>
            </div>
        </div>
        <div class="tw-flex tw-flex-row tw-items-center tw-mt-8 tw-mb-2">
            <h1 class="tw-mr-4 tw-text-xl">{{ $t('system.utilities') }}</h1>
            <v-divider class="border-opacity-75"></v-divider>
        </div>
        <div class="tw-flex tw-flex-row tw-flex-wrap tw-gap-6">
            <div class="tw-flex tw-flex-col tw-items-center" v-if="hasPermission('any')">
                <v-btn @click.prevent="$router.push({name: 'Extensions'})" icon size="x-large" variant="flat">
                    <v-icon icon="mdi-toy-brick-outline" size="42"/>
                </v-btn>
                <div class="tw-text-center tw-mt-2">Extensions</div>
            </div>
            <div class="tw-flex tw-flex-col tw-items-center" v-if="hasPermission('readwrite_task')">
                <v-btn @click.prevent="$router.push({name: 'Tasks'})" icon size="x-large" variant="flat">
                    <v-icon icon="mdi-calendar-check-outline" size="42"/>
                </v-btn>
                <div class="tw-text-center tw-mt-2">{{ $t('system.tasks') }}</div>
            </div>
            <div class="tw-flex tw-flex-col tw-items-center" v-if="hasPermission('any')">
                <v-btn @click.prevent="$router.push({name: 'EmailTest'})" icon size="x-large" variant="flat">
                    <v-icon icon="mdi-email-check-outline" size="42"/>
                </v-btn>
                <div class="tw-text-center tw-mt-2">{{ $t('emails.test') }}</div>
            </div>
            <div class="tw-flex tw-flex-col tw-items-center" v-if="hasPermission('any')">
                <v-btn @click.prevent="$router.push({name: 'SysInfo'})" icon size="x-large" variant="flat">
                    <v-icon icon="mdi-server" size="42"/>
                </v-btn>
                <div class="tw-text-center tw-mt-2">{{ $t('system.info') }}</div>
            </div>
            <div class="tw-flex tw-flex-col tw-items-center" v-if="hasPermission('any')">
                <v-btn @click.prevent="$router.push({name: 'Logs'})" icon size="x-large" variant="flat">
                    <v-icon icon="mdi-console" size="42"/>
                </v-btn>
                <div class="tw-text-center tw-mt-2">{{ $t('system.logs') }}</div>
            </div>
        </div>
        <template v-if="extensions.others.length > 0">
        <div class="tw-flex tw-flex-row tw-items-center tw-mt-8 tw-mb-2">
            <h1 class="tw-mr-4 tw-text-xl">{{ $t('system.other') }}</h1>
            <v-divider class="border-opacity-75"></v-divider>
        </div>
        <div class="tw-flex tw-flex-row tw-flex-wrap tw-gap-6" v-if="extensions.others.length > 0">
            <div v-for="item in extensions.others" class="tw-flex tw-flex-col tw-items-center">
                <v-btn @click.prevent="$router.push({name: 'SettingsDynamicContent', params: {param: item.url}})" icon size="x-large" variant="flat">
                    <v-icon :icon="item.icon" size="42"/>
                </v-btn>
                <div class="tw-text-center tw-mt-2">{{ item.label[$i18n.locale] }}</div>
            </div>
        </div>
        </template>
    </v-card>
    <Loader v-else/>
</template>

<script setup>
import { usePage } from '@/libs/page';
import { ref } from 'vue';
import { Misc } from '@/libs/graphql';
import Loader from '@/components/globals/Loader.vue';
import { hasPermission } from '@/libs/tools';

const page = usePage();
page.setPageTitle('system.settings');

const extensions = ref({entries: [], emails: [], others: []});
const isReady = ref(false);

const loadExtensions = async () =>
{
    extensions.value = await Misc.settingsElements();
    isReady.value = true;
}

loadExtensions();

</script>
