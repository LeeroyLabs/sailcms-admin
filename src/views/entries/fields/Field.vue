<template>
    <v-form v-if="isReady" ref="form" autocomplete="off">
        <BackButton :url="{name: 'EntryFields'}"/>

        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-y-4 tw-gap-x-6">
            <v-text-field
                variant="outlined"
                color="primary"
                v-model="field.name"
                density="comfortable"
                :label="$t('fields.field_name') + ' *'"
                :rules="[rules.required]"
            />

            <v-text-field
                variant="outlined"
                :disabled="$route.params.key !== 'new'"
                color="primary"
                density="comfortable"
                v-model="field.key"
                :label="$t('fields.field_key') + ' *'"
                :rules="($route.params.key === 'new') ? [rules.required, rules.allowed] : []"
                :append-inner-icon="(keyAllowed === null || $route.params.key !== '') ? '' : (keyAllowed) ? 'mdi-check' : 'mdi-close'"
            >
                <template v-slot:details>
                    <span class="tw-mr-[-12px]" :class="{'tw-text-white/40': $vuetify.theme.name === 'dark', 'tw-text-black/60': $vuetify.theme.name === 'light'}">
                        {{ $t('fields.key_explain') }}
                    </span>
                </template>
            </v-text-field>

            <v-text-field
                v-for="(locale, idx) in SailCMS.getLocales()"
                variant="outlined"
                color="primary"
                density="comfortable"
                :label="$t('fields.label') + ' (' + locale + ') *'"
                v-model="field.label[locale]"
                :rules="[rules.required]"
                :class="{'tw-col-span-2': (SailCMS.getLocales().length % 2 !== 0 && idx+1 === SailCMS.getLocales().length)}"
            />

            <v-text-field
                v-for="(locale, idx) in SailCMS.getLocales()"
                variant="outlined"
                color="primary"
                density="comfortable"
                :label="$t('fields.placeholder') + ' (' + locale + ')'"
                v-model="field.placeholder[locale]"
                :class="{'tw-col-span-2': (SailCMS.getLocales().length % 2 !== 0 && idx+1 === SailCMS.getLocales().length)}"
            />

            <v-text-field
                v-for="(locale, idx) in SailCMS.getLocales()"
                variant="outlined"
                color="primary"
                density="comfortable"
                :label="$t('fields.explain') + ' (' + locale + ')'"
                v-model="field.explain[locale]"
                :class="{'tw-col-span-2': (SailCMS.getLocales().length % 2 !== 0 && idx+1 === SailCMS.getLocales().length)}"
            />

            <v-autocomplete
                :model-value="field.type"
                :items="availableTypes"
                id="type-selector"
                label="Type"
                color="primary"
                variant="outlined"
                density="comfortable"
                placeholder="Type"
                :persistent-hint="false"
                :hide-details="true"
                :rules="[rules.required]"
                class="tw-col-span-2"
            >
                <template v-slot:item="{ props, item }">
                    <div
                        @click="updateSelection(item)"
                        class="tw-py-3 tw-px-4 tw-mx-2 tw-rounded-md tw-cursor-pointer"
                        :class="{'hover:tw-bg-neutral-600': $vuetify.theme.name === 'dark', 'hover:tw-bg-neutral-200': $vuetify.theme.name === 'light'}"
                    >
                        {{ item?.raw?.title }}
                        <small class="tw-block">
                            {{ item?.raw?.description }}
                        </small>
                    </div>
                </template>
            </v-autocomplete>

            <div v-if="selectedComponent" class="tw-col-span-2">
                <component :key="'comp_' + selectedComponent.value" :is="selectedComponent.component" :field="field" :type="selectedComponent" @change="(e) => field.config = e"/>
            </div>

            <div class="tw-col-span-2">
                <div class="tw-flex tw-flex-row tw-gap-x-6">
                    <div v-if="!selectedComponent || (selectedComponent && !selectedComponent.hideRepeat)">
                        <v-switch
                            v-model="field.repeatable"
                            :label="$t('fields.repeatable')"
                            color="primary"
                            :value="true"
                            hide-details
                            class="tw-flex-grow"
                        />
                    </div>
                    <div v-if="!selectedComponent || (selectedComponent && !selectedComponent.hideRequired)">
                        <v-switch
                            v-model="field.required"
                            :label="$t('fields.required')"
                            color="primary"
                            :value="true"
                            hide-details
                            class="tw-flex-grow"
                        />
                    </div>
                </div>
            </div>

            <div v-if="field.repeatable" class="tw-col-span-2 tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-y-4 tw-gap-x-6">
                <v-text-field
                    v-for="(locale, idx) in SailCMS.getLocales()"
                    variant="outlined"
                    color="primary"
                    density="comfortable"
                    :label="$t('fields.repeatable_title') + ' (' + locale + ')'"
                    v-model="field.config.repeatable_title[locale]"
                    :class="{'tw-col-span-2': (SailCMS.getLocales().length % 2 !== 0 && idx+1 === SailCMS.getLocales().length)}"
                />
            </div>
        </div>

        <div class="tw-mt-6 tw-flex tw-gap-x-2">
            <v-btn @click.prevent="saveField" variant="flat" :loading="isSaving" color="primary">{{ $t('system.save') }}</v-btn>
            <v-btn @click.prevent="$router.push({name: 'EntryFields'})" variant="text" color="blue">{{ $t('system.cancel') }}</v-btn>
        </div>
    </v-form>
    <Loader v-else/>
</template>

<script setup>
import { usePage } from '@/libs/page';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { availableTypes } from '@/libs/fieldTypes';
import { SailCMS } from '@/libs/graphql';
import { Entries } from '@/libs/graphql/lib/entries';
import { useAppStore } from '@/store/app';
import Loader from '@/components/globals/Loader.vue';
import BackButton from '@/components/globals/BackButton.vue';

const rules = {
    required: value => !!value || i18n.t('user.errors.required'),
    allowed: async (value) =>
    {
        if (value.trim() === 'new') {
            keyAllowed.value = false;
            return i18n.t('fields.errors.key_used');
        }

        if (value.trim() === '') {
            keyAllowed.value = false;
            return i18n.t('fields.errors.key_not_empty');
        }

        let allowed = await Entries.entryFieldValidateKey(value);

        if (allowed) {
            keyAllowed.value = true;
            return true;
        }

        keyAllowed.value = false;
        return i18n.t('fields.errors.key_used');
    }
};

const page = usePage();
const route = useRoute();
const router = useRouter();
const i18n = useI18n();
const store = useAppStore();

const isReady = ref(false);
const form = ref(null);
const field = ref({
    _id: '',
    name: '',
    key: '',
    label: { fr: '', en: '' },
    placeholder: { fr: '', en: '' },
    explain: { fr: '', en: '' },
    repeatable: false,
    validation: '',
    required: false,
    type: null,
    config: {
        repeatable_title: { fr: '', en: '' }
    }
});

const selectedComponent = ref(null);
const isSaving = ref(false);
const keyAllowed = ref(null);

const updateSelection = (v) =>
{
    field.value.type = v.value;
    field.value.config = {};
    selectedComponent.value = availableTypes.value.find(t => t.value === v.value);
    document.querySelector('#type-selector').blur();
};

const saveField = async () =>
{
    if (isSaving.value) return;
    const status = await form.value.validate();
    if (!status.valid) return;

   // isSaving.value = true;
    field.value.validation = field.value.type;
    let result;

    if (route.params.key === 'new') {
        result = await Entries.createEntryField(field.value);
    } else {
        // update
        result = await Entries.updateEntryField(field.value);
    }

    isSaving.value = false;

    if (result) {
        store.displayToast('success', i18n.t('fields.toast.success'));
        await router.push({name: 'EntryFields'});
    } else {
        store.displayToast('error', i18n.t('fields.toast.error'));
    }
}

const loadField = async () =>
{
    field.value = await Entries.entryField(route.params.key);

    let activeType = availableTypes.value.find(type => type.value === field.value.type);
    if (activeType) selectedComponent.value = activeType;

    if (!field.value.config.repeatable_title) {
        let opts = {};
        for (let locale of SailCMS.getLocales()) {
            opts[locale] = '';
        }

        field.value.config.repeatable_title = opts;
    }

    page.setPageTitle('fields.editing', `'${route.params.key}'`)
    isReady.value = true;
}

if (route.params.key === 'new') {
    page.setPageTitle('fields.new');
} else {
    loadField();
}

onMounted(() =>
{
    if (route.params.key === 'new') isReady.value = true;
});
</script>
