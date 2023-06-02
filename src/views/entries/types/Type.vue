<template>
    <div v-if="isReady" class="tw-p-6 tw-w-full md:tw-w-10/12 lg:tw-w-8/12 xl:tw-w-8/12 2xl:tw-w-7/12 tw-ml-0">
        <v-form ref="form" class="tw-flex-grow">
            <div class="tw-mt-6 md:tw-mt-0">
                <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-x-4 tw-mb-4 tw-gap-y-4 md:tw-gap-y-0">
                    <v-text-field
                        color="primary"
                        :label="$t('entry_types.type_title')"
                        variant="outlined"
                        type="text"
                        :rules="[rules.required]"
                        validate-on="blur"
                        v-model="currentType.title"
                        density="comfortable"
                    />
                    <v-text-field
                        color="primary"
                        :label="$t('entry_types.handle')"
                        variant="outlined"
                        type="text"
                        :rules="[rules.required]"
                        validate-on="blur"
                        v-model="currentType.handle"
                        density="comfortable"
                        @keydown="formatValue"
                        :readonly="!isAdding"
                    />

                    <v-text-field
                        v-for="(locale, key) in SailCMS.locales"
                        :key="key"
                        color="primary"
                        :label="$t('entry_types.prefix', {locale: locale})"
                        variant="outlined"
                        type="text"
                        v-model="currentType.url_prefix[key].data"
                        density="comfortable"
                        @keydown="formatValue"
                    >
                        <template v-slot:details>{{ $t('entry_types.leave_blank') }}</template>
                    </v-text-field>
                </div>
                <v-btn
                    :loading="isSaving"
                    @click.prevent="saveType"
                    variant="flat"
                    color="primary"
                    class="tw-mr-2"
                >
                    {{ (isAdding) ? $t('system.add') : $t('system.save') }}
                </v-btn>
                <v-btn @click.prevent="cancelSave" variant="flat">{{ $t('system.cancel') }}</v-btn>
            </div>
        </v-form>
    </div>
    <Loader v-else/>
</template>

<script setup>
import { usePage } from '@/libs/page';
import { nextTick, ref } from 'vue';
import Loader from '@/components/globals/Loader.vue';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/store/app';
import { SailCMS } from '@/libs/graphql';
import { useRoute, useRouter } from 'vue-router';
import { Entries } from '@/libs/graphql/lib/entries';
import { hasPermission } from '@/libs/tools';

const isReady = ref(false);
const isAdding = ref(true);
const isSaving = ref(false);
const form = ref(null);

const page = usePage();
const i18n = useI18n();
const store = useAppStore();
const route = useRoute();
const router = useRouter();

const currentType = ref({
    _id: '',
    title: '',
    handle: '',
    url_prefix: [],
    entry_layout_id: ''
});

const rules = {required: value => !!value || i18n.t('user.errors.required')}

const loadType = async () =>
{
    let result = await Entries.entryType(route.params.id, SailCMS.locales);

    // Process result
    if (result) {
        let prefixes = [];
        let keys = Object.keys(result.url_prefix);

        for (let key of keys) {
            prefixes.push({locale: key, data: result.url_prefix[key]});
        }

        currentType.value = result;
        currentType.value.url_prefix = prefixes;
    }

    page.setPageTitle(result.title);
    isReady.value = true;
}

const saveType = async () =>
{
    if (isSaving.value) return;

    const status = await form.value.validate();
    if (!status.valid) return;

    isSaving.value = true;
    let result;

    if (isAdding.value) {
        result = await Entries.createEntryType(currentType.value);
    } else {
        result = await Entries.updateEntryType(currentType.value);
    }

    if (result === 'ok') {
        // Reload list of types
        await nextTick(async () =>
        {
            store.displayToast('success', i18n.t('entry_types.save_success', { name: currentType.value.title }));
            await router.go({ name: 'EntryTypes' });
        });
        return;
    } else {
        store.displayToast('error', i18n.t('entry_types.errors.' + result, {name: currentType.value.title}));
    }

    isSaving.value = false;
}

const cancelSave = async () =>
{
    if (isSaving.value) return;
    await router.push({name: 'EntryTypes'})
}

const formatValue = (e) =>
{
    if (currentType.value.title.includes('.')) {
        currentType.value.title = currentType.value.title.replace('.', '');
    }

    if (e.key === 'Backspace') return true;
    if (e.key === 'Tab') return true;
    if (e.key === ' ') e.preventDefault();

    const allowed = 'abcdefghijklmnopqrstuvwxyz0123456789-'
    let val = allowed.includes(e.key);

    if (!val) {
        e.preventDefault();
    }

    return true;
}

for (let locale of SailCMS.locales) {
    currentType.value.url_prefix.push({locale: locale, data: ''});
}

if (!hasPermission('readwrite_entry_type')) {
    router.push({name: 'EntryTypes'});
}

if (route.params.id === 'add') {
    isAdding.value = true;
    isReady.value = true;
    page.setPageTitle('entry_types.single_add');
} else {
    isAdding.value = false;
    loadType();
}
</script>
