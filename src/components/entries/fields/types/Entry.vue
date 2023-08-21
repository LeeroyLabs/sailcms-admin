<template>
    <div class="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-y-4 tw-gap-x-6 tw-mt-4">
        <v-select
            :items="entryTypes"
            :model-value="internalValue.type"
            id="type-selector"
            :label="$t('fields.options.entry_type') + ' *'"
            color="primary"
            variant="outlined"
            density="comfortable"
            :placeholder="$t('fields.options.country')"
            :rules="[rules.required]"
            :persistent-hint="false"
            class="tw-col-span-2"
        ></v-select>

        <div class="tw-col-span-2 tw-mt-[-10px]">
            <div class="tw-flex tw-flex-row tw-gap-x-6">
                <v-switch
                    v-model="internalValue.multi"
                    :label="$t('fields.options.multi')"
                    color="primary"
                    value="1"
                    hide-details
                    class="tw-flex-grow"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { watch, ref, computed } from 'vue';
import { cloneDeep } from 'lodash';
import { useI18n } from 'vue-i18n';
import { Countries } from '@/libs/countries';
import { Entries } from '@/libs/graphql/lib/entries';
import { SailCMS } from '@/libs/graphql';

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

const entryTypes = ref([]);

const emitter = defineEmits(['change']);
const internalValue = ref({type: props.field.config.type || null, multi: props.field.config.multi || false});

watch(internalValue.value, (v) =>
{
    const config = cloneDeep(props.field.config);
    config.type = v.type;
    config.multi = v.multi;
    emitter('change', config);
});

const loadTypes = async () =>
{
    const types = await Entries.entryTypes(SailCMS.getLocales());

    for (let type of types) {
        entryTypes.value.push({value: type.handle, title: type.title});
    }
}

loadTypes();
</script>
