<template>
    <div class="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-y-4 tw-gap-x-6 tw-mt-4">
        <v-select
            :items="CountryList"
            :model-value="internalValue.country"
            id="type-selector"
            :label="$t('fields.options.country')"
            color="primary"
            variant="outlined"
            density="comfortable"
            :placeholder="$t('fields.options.country')"
            :hide-details="true"
            :persistent-hint="false"
            class="tw-col-span-2"
        ></v-select>
    </div>
</template>

<script setup>
import { watch, ref, computed } from 'vue';
import { cloneDeep } from 'lodash';
import { useI18n } from 'vue-i18n';
import { Countries } from '@/libs/countries';

const i18n = useI18n();

const rules = {
    required: value => !!value || i18n.t('user.errors.required'),
};

const props = defineProps({
    field: {
        type: Object,
        default: {}
    },
    type: {
        type: Object,
        default: {}
    }
});

const CountryList = computed(() =>
{
    const selectList = [{value: 'all', title: i18n.t('fields.options.all_countries')}];

    for (let code of Countries) {
        selectList.push({value: code, title: i18n.t('countries.' + code)});
    }

    return selectList;
});

const emitter = defineEmits(['change']);
const internalValue = ref({country: 'CA'});

watch(internalValue.value, (v) =>
{
    const config = cloneDeep(props.field.config);
    config.country = v.country;
    emitter('change', config);
});
</script>
