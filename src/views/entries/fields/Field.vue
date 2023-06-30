<template>
    label
    placeholder
    explain
    repeatable
    required
    type (defaults to text)

    <v-autocomplete
        :model-value="selectedType"
        :items="availableTypes"
        label="Type"
        color="primary"
        variant="outlined"
        density="comfortable"
        single-line
        placeholder="Type"
        :persistent-hint="false"
        :hide-details="true"
    >
        <template v-slot:item="{ props, item }">
            <div
                class="tw-py-3 tw-px-4 tw-mx-2 tw-rounded-md"
                :class="{'hover:tw-bg-neutral-600': $vuetify.theme.name === 'dark', 'hover:tw-bg-neutral-200': $vuetify.theme.name === 'light'}"
            >
                {{ item?.raw?.title }}
                <small class="tw-block">
                    {{ item?.raw?.description }}
                </small>
            </div>
        </template>
    </v-autocomplete>
</template>

<script setup>
import { usePage } from '@/libs/page';
import { useRoute } from 'vue-router';
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { sortBy } from 'lodash';

const page = usePage();
const route = useRoute();
const i18n = useI18n();

const availableTypes = computed(() =>
{
    return sortBy([
        { value: 'text', title: i18n.t('fields.types.text'), description: i18n.t('fields.descriptions.text') },
        { value: 'textarea', title: i18n.t('fields.types.textarea'), description: i18n.t('fields.descriptions.textarea') },
        { value: 'html', title: i18n.t('fields.types.html'), description: i18n.t('fields.descriptions.html') },
        { value: 'numeric', title: i18n.t('fields.types.numeric'), description: i18n.t('fields.descriptions.numeric') },
        { value: 'integer', title: i18n.t('fields.types.integer'), description: i18n.t('fields.descriptions.integer') },
        { value: 'float', title: i18n.t('fields.types.float'), description: i18n.t('fields.descriptions.float') },
        { value: 'password', title: i18n.t('fields.types.password'), description: i18n.t('fields.descriptions.password') },
        { value: 'email', title: i18n.t('fields.types.email'), description: i18n.t('fields.descriptions.email') },
        { value: 'phone', title: i18n.t('fields.types.phone'), description: i18n.t('fields.descriptions.phone') },
        { value: 'creditcard', title: i18n.t('fields.types.creditcard'), description: i18n.t('fields.descriptions.creditcard') },
        { value: 'asset_file', title: i18n.t('fields.types.asset_file'), description: i18n.t('fields.descriptions.asset_file') },
        { value: 'asset_image', title: i18n.t('fields.types.asset_image'), description: i18n.t('fields.descriptions.asset_image') },
        { value: 'url', title: i18n.t('fields.types.url'), description: i18n.t('fields.descriptions.url') },
        { value: 'domain', title: i18n.t('fields.types.domain'), description: i18n.t('fields.descriptions.domain') },
        { value: 'directory', title: i18n.t('fields.types.directory'), description: i18n.t('fields.descriptions.directory') },
        { value: 'file', title: i18n.t('fields.types.file'), description: i18n.t('fields.descriptions.file') },
        { value: 'ip', title: i18n.t('fields.types.ip'), description: i18n.t('fields.descriptions.ip') },
        { value: 'select', title: i18n.t('fields.types.select'), description: i18n.t('fields.descriptions.select') },
        { value: 'entry', title: i18n.t('fields.types.entry'), description: i18n.t('fields.descriptions.entry') },
        { value: 'entry_list', title: i18n.t('fields.types.entry_list'), description: i18n.t('fields.descriptions.entry_list') },
        { value: 'category', title: i18n.t('fields.types.category'), description: i18n.t('fields.descriptions.category') },
        { value: 'categories', title: i18n.t('fields.types.categories'), description: i18n.t('fields.descriptions.categories') },
        { value: 'switch', title: i18n.t('fields.types.switch'), description: i18n.t('fields.descriptions.switch') },
        { value: 'hex', title: i18n.t('fields.types.hex'), description: i18n.t('fields.descriptions.hex') },
        { value: 'postal', title: i18n.t('fields.types.postal'), description: i18n.t('fields.descriptions.postal') },
        { value: 'country', title: i18n.t('fields.types.country'), description: i18n.t('fields.descriptions.country') },
        { value: 'date', title: i18n.t('fields.types.date'), description: i18n.t('fields.descriptions.date') },
        { value: 'datetime', title: i18n.t('fields.types.datetime'), description: i18n.t('fields.descriptions.datetime') },
        { value: 'time', title: i18n.t('fields.types.time'), description: i18n.t('fields.descriptions.time') },
        { value: 'checkbox', title: i18n.t('fields.types.checkbox'), description: i18n.t('fields.descriptions.checkbox') },
        { value: 'radio', title: i18n.t('fields.types.radio'), description: i18n.t('fields.descriptions.radio') },
        { value: 'id', title: i18n.t('fields.types.id'), description: i18n.t('fields.descriptions.id') },
        { value: 'matrix', title: i18n.t('fields.types.matrix'), description: i18n.t('fields.descriptions.matrix') }
    ], ['value']);
});

const selectedType = ref(i18n.t('fields.types.text'));

watch(selectedType, (v) =>
{
    const item = availableTypeKeys.value.find(type => type.title === selectedType.value.title);
    currentType.value = item.value
});

if (route.params.key === 'new') {
    page.setPageTitle('fields.new');
}
</script>
