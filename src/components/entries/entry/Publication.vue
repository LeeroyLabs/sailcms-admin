<template>
    <div class="tw-rounded-md" :class="{'tw-bg-white ': $vuetify.theme.name === 'light', 'tw-bg-darkbg': $vuetify.theme.name === 'dark'}">
        <div class="tw-p-4">
            <div class="panel-info !tw-px-0">
                <div>
                    <p v-if="entry.publication" class="!tw-text-neutral-600">{{ $t('entry.publish_string1') }} <b>xxx</b> {{ $t('entry.publish_string2') }} <b>xx-xx-xxxx</b> {{ $t('entry.publish_string3') }} <b>xx:xx</b></p>
                    <div v-else>
                        <DateTime v-model="value" :index="0" id="_publishing" :minute-increment="15" :config="config"/>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="panel-bottom"
            :class="{'tw-border-gray-200 tw-bg-gray-50': $vuetify.theme.name === 'light', 'tw-bg-lightdark tw-border-neutral-700': $vuetify.theme.name === 'dark'}"
        >

            <v-btn v-if="entry.publication" variant="text" color="warning">Unpublish</v-btn>
            <v-btn v-else variant="flat" color="green">Publish Now</v-btn>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import DateTime from '@/components/entries/entry/fields/DateTime.vue';

const props = defineProps({
    entry: {
        type: Object,
        default: {}
    }
});

const value = ref('');

const config = {
    label: {en: 'Publish on', fr: 'Publier le'},
    explain: {en: '', fr: ''},
    placehoder: {en: '', fr: ''},
    id: 'publishing',
    name: 'publish_date',
    validation: '',
    repeatable: false,
    config: {
        range: false,
        date_format: 'd-m-Y',
        time_format: 'H:i',
        showTime: true
    },
    width: 'full'
};

</script>

<style lang="postcss">
.panel-title {
    @apply tw-font-medium;
}

.panel-info {
    @apply tw-p-4 tw-flex tw-flex-col tw-gap-y-2;
}

.panel-info div {
    @apply tw-flex tw-flex-col;
}

.panel-info div h2 {
    @apply tw-font-medium tw-text-neutral-600;
}

.panel-info div p {
    @apply tw-text-sm;
}

.panel-bottom {
    @apply tw-mt-4 tw-px-4 tw-py-3 tw-rounded-b-md tw-border-t tw-flex tw-flex-row tw-items-center tw-justify-end tw-gap-x-2;
}
</style>
