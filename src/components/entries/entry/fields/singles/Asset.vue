<template>
    <div class="tw-w-full tw-flex tw-flex-row tw-items-start tw-gap-x-2">
        <img alt="" :src="(selectedImage !== '') ? selectedImage : 'https://placehold.co/48x48?text=placeholder'" v-if="type === 'image'" class="tw-rounded-md tw-h-[48px] tw-w-[48px]"/>
        <v-text-field
            ref="phRef"
            variant="outlined"
            color="primary"
            density="comfortable"
            :label="config.label[$i18n.locale] + ((config.required) ? ' *' : '')"
            validate-on="blur"
            :rules="validationRules"
            :hide-details="true"
            :model-value="imageName"
            :readonly="true"
            autocomplete="new-password"
        >
            <template v-if="config.explain[$i18n.locale] !== '' && !multi">
                <div class="tw-absolute tw-right-0 tw-text-sm tw-top-[48px] tw-text-gray-400">
                    {{ config.explain[$i18n.locale] }}
                </div>
            </template>
        </v-text-field>

        <v-btn class="!tw-h-[48px]" variant="flat" color="primary" @click.prevent="showAM=true">
            <v-icon icon="mdi-dots-horizontal"/>
        </v-btn>
    </div>

    <v-text-field :model-value="value" class="!tw-hidden"/>

    <Transition>
        <AssetManager v-if="showAM" :mode="type" :multi="false" :cropping="cropping" @close="showAM=false" @selected="handleSelectedAsset" />
    </Transition>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue';
import AssetManager from '@/components/globals/AssetManager.vue';
import { useI18n } from 'vue-i18n';
import { v4 } from 'uuid';

const showAM = ref(false);

const i18n = useI18n();

const props = defineProps({
    value: {
        default: null
    },
    multi: {
        type: Boolean,
        default: false
    },
    config: {
        type: Object,
        default: {type: '', label: '', name: '', validation: '', required: false, repeatable: false, config: null}
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

const emitter = defineEmits(['change']);
const selectedImage = ref('');
const imageName = ref('');
const phRef = ref(null);

const rules = {
    required: value => !!value && value.trim() !== '' || i18n.t('user.errors.required')
};

const cropping = computed(() =>
{
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

const validationRules = computed(() =>
{
    const activeRules = [];
    if (props.config.required) activeRules.push(rules.required);

    return activeRules;
});

const handleSelectedAsset = (e) =>
{
    const image = e[0];
    selectedImage.value = image.url;
    imageName.value = image.name;
    emitter('change', image._id)

    showAM.value = false;

    nextTick(() =>
    {
        phRef.value.validate();
    });
}
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
</style>
