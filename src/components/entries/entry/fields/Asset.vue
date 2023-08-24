<template>
    <div>
        <template v-if="config.repeatable">
            <div
                class="tw-border tw-rounded-md tw-p-4 t-pt-2 tw-relative"
                :class="{
                    'tw-border-neutral-400': $vuetify.theme.name === 'light',
                    'tw-border-neutral-500': $vuetify.theme.name === 'dark'
                }"
            >
                <h2 class="tw-text-lg tw-mb-4">{{ config.config.repeatable_title[$i18n.locale]}}</h2>
                <v-btn class="tw-absolute tw-top-4 tw-right-4" color="primary" variant="flat" @click.prevent="showAM=true">
                    <v-icon icon="mdi-plus" size="large"/>
                </v-btn>

                <template v-if="arrayValue.length === 0">

                    <h3
                        class="tw-text-center tw-text-xl tw-my-12"
                        :class="{
                        'tw-text-neutral-400': $vuetify.theme.name === 'light',
                        'tw-text-neutral-500': $vuetify.theme.name === 'dark'
                    }"
                    >
                        {{ $t('system.no_items_now') }}
                    </h3>
                </template>

                <div class="tw-flex tw-gap-4" :class="{'tw-flex-row': type === 'image', 'tw-flex-col tw-mt-8': type !== 'image'}" :id="'assets_' + instanceId">
                    <template v-for="(item, idx) in selectedItems" :key="'asset_' + type + '_' + item._id">
                        <div v-if="type === 'image'" :data-id="item._id" class="tw-flex tw-flex-col tw-gap-y-2 tw-cursor-grab">
                            <div
                                class="tw-w-[100px] tw-h-[100px] tw-bg-center tw-bg-no-repeat tw-bg-cover tw-rounded-md"
                                :style="'background-image: url(' + item.url + ')'"
                            >
                            </div>
                            <v-btn @click.prevent="() => removeItem(item, idx)" variant="tonal" color="red"><v-icon icon="mdi-trash-can-outline" /></v-btn>
                        </div>
                        <div v-else class="tw-flex tw-flex-row tw-items-center tw-justify-between">
                            <div class="tw-flex tw-flex-row tw-gap-x-2 tw-items-center">
                                <v-icon icon="mdi-file-outline"/>
                                <h4>{{ item.title[$i18n.locale] }}</h4>
                            </div>
                            <v-btn @click.prevent="() => removeItem(item, idx)" variant="tonal" color="red"><v-icon icon="mdi-trash-can-outline" /></v-btn>
                        </div>
                    </template>
                </div>
            </div>
            <Transition>
                <AssetManager v-if="showAM" :mode="type" :multi="true" :cropping="cropping" @close="showAM=false" @selected="handleSelectedAssets" />
            </Transition>
        </template>
        <template v-else>
            <Asset
                :value="modelValue"
                :config="config"
                :type="type"
                :index="index"
                :key="'text_' + type + '_' + index"
                @change="(e) => $emit('update:modelValue', e)"
                :class="{'tw-mb-4': config.explain[$i18n.locale] !== ''}"
            />
        </template>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { watch, ref, computed, onMounted } from 'vue';
import Asset from './singles/Asset.vue'
import AssetManager from '@/components/globals/AssetManager.vue';
import { uniqBy, uniq } from 'lodash';
import { v4 } from 'uuid';
import Sortable from 'sortablejs';

const i18n = useI18n();
const arrayValue = ref([]);
const selectedItems = ref([]);
const showAM = ref(false);
const instanceId = ref(v4());

const props = defineProps({
    modelValue: {
        default: null
    },
    config: {
        type: Object,
        default: {type: '', label: '', name: '', validation: '', required: false, repeatable: false, config: null, width: 'full'}
    },
    type: {
        type: String,
        default: 'image'
    },
    index: {
        type: Number,
        default: 0
    }
});

const cropping = computed(() =>
{
    console.log(props.config.config?.allowed_types);
    return {
        name: props.config.config.name,
        ratio: props.config.config.ratio || 0,
        allowed: props.config.config?.allowed_types || '',
        min: {
            width: props.config.config?.min?.width || 0,
            height: props.config.config?.min?.height || 0
        },
        max: {
            width: props.config.config?.max?.width || 0,
            height: props.config.config?.max?.height || 0
        },
        lockedType: props.config.config?.lockedType || ''
    };
});

const emitter = defineEmits(['update:modelValue']);

const handleSelectedAssets = (e) =>
{
    selectedItems.value.push(...e);

    for (let item of e) {
        arrayValue.value.push(item._id);
    }

    arrayValue.value = uniq(arrayValue.value);
    selectedItems.value = uniqBy(selectedItems.value, '_id');
    showAM.value = false;
}

const removeItem = (item, index) =>
{
    document.querySelector('[data-id="' + item._id + '"]')?.remove();
    const children = Array.from(document.querySelector('#assets_' + instanceId.value).children);
    const items = [];

    for (let child of children) {
        const id = child.getAttribute('data-id') ?? '';
        if (id !== '') items.push(id);
    }

    selectedItems.value = selectedItems.value.filter(i => items.includes(i._id));
    arrayValue.value = items;
}

const sortingChange = (e) =>
{
    const children = Array.from(document.querySelector('#assets_' + instanceId.value).children);
    const items = [];

    for (let child of children) {
        items.push(child.getAttribute('data-id'));
    }

    arrayValue.value = items;
}

onMounted(() =>
{
    if (props.config.repeatable) {
        const el = document.querySelector('#assets_' + instanceId.value);

        if (el) {
            new Sortable(
                el,
                {
                    tag: 'div',
                    direction: 'horizontal',
                    ghostClass: 'ghost',
                    animation: 300,
                    swapTreshold: 0.05,
                    dragoverBubble: false,
                    onEnd: sortingChange
                }
            );
        }
    }
});

// Report back any changes to the array
watch(arrayValue, (v) => emitter('update:modelValue', arrayValue, {deep: true}));
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.35s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

.ghost {
    opacity: 0.65;
}
</style>
