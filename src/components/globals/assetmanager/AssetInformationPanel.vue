<template>
    <div class="tw-absolute tw-bg-black/40 tw-inset-0 tw-flex tw-flex-row tw-justify-end tw-z-[9999]">
        <v-card rounded class="tw-p-6 tw-duration-300 tw-transition-all" :class="{'tw-mr-[-300px]': !show, 'tw-mr-[0px]': show}">
            <div class="tw-max-w-[250px] tw-w-[250px]">
                <div class="tw-flex tw-flex-row tw-justify-between tw-items-center">
                    <h1 class="tw-text-2xl">Information</h1>
                    <v-btn @click.prevent="closePanel" flat icon="mdi-close"/>
                </div>
                <div class="tw-mt-6">
                    <div class="tw-mb-6">
                        <v-text-field
                            v-for="locale in store.locales"
                            variant="outlined"
                            color="primary"
                            density="comfortable"
                            :hide-details="true"
                            class="tw-mb-4"
                            validate-on="blur"
                            v-model="file.title[locale]"
                            :rules="[rules.required]"
                            @blur="saveTitleChange(locale)"
                            :label="$t('assets.img_title') + ' (' + locale + ')'"
                        />
                    </div>

                    <div class="info-row">
                        <span class="tw-mr-4">{{ $t('assets.info.filename') }}:</span>
                        <span class="tw-overflow-ellipsis tw-truncate">{{ file.name }}</span>
                    </div>
                    <div class="info-row">
                        <span>{{ $t('assets.info.filesize') }}:</span>
                        <span>{{ humanFileSize(file.filesize) }}</span>
                    </div>
                    <div class="info-row">
                        <span>{{ $t('assets.info.size') }}:</span>
                        <span>{{ file.size.width }}x{{ file.size.height}}</span>
                    </div>
                    <div class="info-row">
                        <span>{{ $t('assets.info.transform_count') }}:</span>
                        <span>{{ file.transforms.length }}</span>
                    </div>
                    <div class="info-row">
                        <span class="tw-mr-16">{{ $t('assets.info.uploaded_by') }}:</span>
                        <span class="tw-overflow-ellipsis tw-truncate">{{ file.uploader?.name.full || 'Unknown' }}</span>
                    </div>
                    <div class="info-row">
                        <span>{{ $t('assets.info.uploaded_on') }}:</span>
                        <span>{{ format(file.created_at * 1000, 'dd-MM-yyyy') }}</span>
                    </div>
                </div>
            </div>
        </v-card>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { humanFileSize } from '@/libs/tools';
import { useAppStore } from '@/store/app';
import { useI18n } from 'vue-i18n';
import { Assets } from '@/libs/graphql';
import { format } from 'date-fns';

const i18n = useI18n();
const store = useAppStore();
const show = ref(false);

const emitter = defineEmits(['close']);

const props = defineProps({
    file: {
        type: Object,
        default: null
    }
});

const rules = {
    required: value => !!value || i18n.t('login.errors.required'),
};

const saveTitleChange = async (locale) =>
{
    await Assets.updateAssetTitle(props.file._id, locale, props.file.title[locale]);
}

const closePanel = () =>
{
    show.value = false;
    setTimeout(() => emitter('close'), 250);
}

onMounted(() =>
{
    setTimeout(() => show.value = true, 250);
});
</script>

<style lang="postcss">
.info-row {
    @apply tw-flex tw-flex-row tw-justify-between;
}
</style>
