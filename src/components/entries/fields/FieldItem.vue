<template>
    <li :id="'field-' + id" class="tw-border tw-border-gray-300 tw-p-4 tw-py-1 tw-rounded-md" :class="{'tw-bg-white': $vuetify.theme.name === 'light', 'tw-bg-darkbg': $vuetify.theme.name === 'dark'}">
        <div class="tw-flex tw-flex-row tw-items-center tw-justify-between">
            <div class="tw-mr-2 tw-cursor-grab dnd-handle">
                <v-icon icon="mdi-menu"/>
            </div>
            <h1 class="tw-text-lg tw-font-medium tw-flex-grow">{{ config.name.replace('Field', '').replace('Asset', '') }} &mdash; {{ fieldSetup.title[$i18n.locale] !== '' ? fieldSetup.title[$i18n.locale] : $t('layout.untitled') }}</h1>
            <div>
                <v-btn @click.prevent="toggleStatus" variant="flat" :icon="opened ? 'mdi-minus' : 'mdi-plus'"/>
            </div>
            <div class="tw-text-red-500">
                <v-btn @click.prevent="$emit('remove', id)" variant="flat" icon="mdi-trash-can-outline"/>
            </div>
        </div>

        <Transition>
            <div class="tw-transition-all tw-duration-100" v-if="opened">
                <div class="tw-grid tw-grid-cols-2 tw-mt-4 tw-gap-4 tw-mb-4">
                    <v-text-field
                        hide-details
                        variant="outlined"
                        color="primary"
                        density="comfortable"
                        :label="$t('layout.configs.title_fr')"
                        v-model="fieldSetup.title.fr"
                        :rules="[rules.required]"
                    />

                    <v-text-field
                        hide-details
                        variant="outlined"
                        color="primary"
                        density="comfortable"
                        :label="$t('layout.configs.title_en')"
                        v-model="fieldSetup.title.en"
                        :rules="[rules.required]"
                    />
                </div>

                <div class="tw-mt-4 tw-gap-4 tw-mb-4">
                    <v-text-field
                        variant="outlined"
                        color="primary"
                        density="comfortable"
                        :label="$t('layout.configs.key')"
                        v-model="fieldSetup.key"
                        :rules="[rules.required, rules.minLength]"
                    >
                        <template v-slot:details>{{ $t('layout.field_key') }}</template>
                    </v-text-field>
                </div>

                <template v-if="!noSettingsFields.includes(config.name)">
                    <v-divider :thickness="2" :class="{'!tw-border-gray-400': $vuetify.theme.name === 'light'}" class="tw-my-6"></v-divider>

                    <h3 class="tw-text-lg tw-font-medium tw-mb-4">Settings</h3>
                    <div class="tw-grid tw-grid-cols-2 tw-gap-4">
                        <template v-for="input in config.inputs">
                            <div class="tw-relative" v-for="(config, idx) in input.availableSettings.filter(s => s.type !== 'checkbox')">
                                <v-text-field
                                    v-if="config.type === 'number'"
                                    type="number"
                                    hide-details
                                    variant="outlined"
                                    color="primary"
                                    density="comfortable"
                                    :label="$t('layout.configs.' + config.name)"
                                    v-model="fieldSetup[config.name]"
                                    :class="{'tw-col-span-2': !input.availableSettings.filter(s => s.type !== 'checkbox')[idx+1]}"
                                >
                                    <template v-slot:details><span v-if="config.explain">{{ $t('layout.field_key') }}</span></template>
                                </v-text-field>

                                <v-text-field
                                    v-if="config.type === 'string'"
                                    hide-details
                                    variant="outlined"
                                    color="primary"
                                    density="comfortable"
                                    :label="$t('layout.configs.' + config.name)"
                                    v-model="fieldSetup[config.name]"
                                    :class="{'tw-col-span-2': !input.availableSettings.filter(s => s.type !== 'checkbox')[idx+1]}"
                                />

                                <v-select
                                    v-if="config.type === 'options'"
                                    hide-details
                                    variant="outlined"
                                    color="primary"
                                    density="comfortable"
                                    :label="$t('layout.configs.' + config.name)"
                                    :items="setupItemArray(config.options)"
                                    v-model="fieldSetup[config.name]"
                                />

                                <div v-if="config.explain" class="tw-absolute tw-top-[10px] tw-right-[10px] tw-text-zinc-500" :class="{'tw-right-[40px]': (config.type === 'options' || config.type === 'checkbox')}">
                                    <v-icon icon="mdi-help-circle-outline"/>
                                    <v-tooltip activator="parent" location="bottom">{{ $t('layout.explain.' + config.name) }}</v-tooltip>
                                </div>
                            </div>
                        </template>
                    </div>

                    <div class="tw-grid md:tw-grid-cols-4 2xl:tw-grid-cols-6 tw-gap-4">
                        <template v-for="input in config.inputs">
                            <template v-for="config in input.availableSettings">
                                <v-checkbox
                                    v-if="config.type === 'checkbox'"
                                    hide-details
                                    v-model="fieldSetup[config.name]"
                                    :value="true"
                                    name="required"
                                    :label="$t('layout.configs.' + config.name)"
                                />
                            </template>
                        </template>
                    </div>
                </template>
            </div>
        </Transition>
    </li>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const i18n = useI18n();

const rules = {
    required: value => !!value || i18n.t('user.errors.required'),
    minLength: value => value.length >= 3 || i18n.t('system.length_error')
}

const props = defineProps({
    config: {
        type: Object,
        default: null
    },
    id: {
        type: String,
        default: ''
    }
});

defineEmits(['remove']);

const fieldSetup = ref({title: {fr: '', en: ''}, key: ''});
const opened = ref(true);

const noSettingsFields = [];

const setupBase = () =>
{
    for (let input of props.config.inputs) {
        for (let conf of input.availableSettings) {
            switch (conf.type)
            {
                case 'number':
                case 'text':
                case 'string':
                case 'options':
                    if (conf.name === 'allowedFormats') {
                        fieldSetup.value[conf.name] = '.pdf,.doc,.docx,.xls,.xlsx';
                    } else {
                        fieldSetup.value[conf.name] = '';
                    }
                    break;

                case 'checkbox':
                    fieldSetup.value[conf.name] = false;
                    break;
            }
        }
    }
}

const toggleStatus = () =>
{
    if (opened.value) {
        opened.value = false;
        return;
    }

    opened.value = true;
}

const getInfo = () =>
{
    return {config: props.config, id: props.id, data: fieldSetup.value};
};

const setupItemArray = (options) =>
{
    const list = [];

    for (let option of options) {
        list.push({value: option.value, title: option.label});
    }

    return list;
}

defineExpose({ getInfo });

setupBase();
</script>

<style lang="postcss">
.v-enter-active,
.v-leave-active {
    transition: opacity 0.35s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
