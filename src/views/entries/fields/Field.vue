<template>
    <v-form ref="form" autocomplete="off">
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-y-4 tw-gap-x-6">
            <v-text-field
                variant="outlined"
                color="primary"
                density="comfortable"
                :label="$t('fields.field_name') + ' *'"
                :rules="[rules.required]"
            />

            <v-text-field
                variant="outlined"
                color="primary"
                density="comfortable"
                :label="$t('fields.field_key') + ' *'"
                :rules="[rules.required]"
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
                :hide-details="true"
                :persistent-hint="false"
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

            <div class="tw-col-span-2">
                <template v-if="selectedComponent">
                    <component :is="selectedComponent.component" :field="field" :type="selectedComponent" @change="(e) => field.config = e"/>
                </template>
            </div>

            <div class="tw-col-span-2 tw-mt-[-10px]">
                <div class="tw-flex tw-flex-row tw-gap-x-6">
                    <div v-if="!selectedComponent || (selectedComponent && !selectedComponent.hideRepeat)">
                        <v-switch
                            v-model="field.repeatable"
                            :label="$t('fields.repeatable')"
                            color="primary"
                            value="1"
                            hide-details
                            class="tw-flex-grow"
                        />
                    </div>
                    <div v-if="!selectedComponent || (selectedComponent && !selectedComponent.hideRequired)">
                        <v-switch
                            v-model="field.required"
                            :label="$t('fields.required')"
                            color="primary"
                            value="1"
                            hide-details
                            class="tw-flex-grow"
                        />
                    </div>
                </div>
            </div>
        </div>
    </v-form>
</template>

<script setup>
import { usePage } from '@/libs/page';
import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { availableTypes } from '@/libs/fieldTypes';
import { SailCMS } from '@/libs/graphql';

const rules = {
    required: value => !!value || i18n.t('user.errors.required')
};

const page = usePage();
const route = useRoute();
const i18n = useI18n();

const form = ref(null);
const field = ref({
    name: '',
    key: '',
    label: { fr: '', en: '' },
    placeholder: { fr: '', en: '' },
    explain: { fr: '', en: '' },
    repeatable: false,
    validation: '',
    required: false,
    type: null,
    config: {}
});

const selectedComponent = ref(null);

const updateSelection = (v) =>
{
    field.value.type = v.value;
    selectedComponent.value = availableTypes.value.find(t => t.value===v.value);

    console.log(field.value.type);
    document.querySelector('#type-selector').blur();
};

watch(field.value, (v) =>
{
    console.log(v);
});

if (route.params.key==='new') {
    page.setPageTitle('fields.new');
}
</script>
