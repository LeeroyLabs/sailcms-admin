<template>
    <template v-if="isReady">
    <div class="tw-mb-6">
        TITLE FIELD HERE
    </div>
    <div class="tw-flex tw-flex-row tw-w-full tw-gap-4">
        <div class="tw-w-3/12">
            <v-card class="tw-p-4 tw-flex tw-flex-col tw-gap-y-4">
                <div class="tw-bg-gray-200 tw-rounded-md tw-p-2">Text Inputs</div>
                <div class="tw-px-2">
                    <div class="fieldbox" v-for="field in inputFields">
                        <h2 class="tw-font-medium">{{ cleanName(field.name) }}</h2>
                        <div class="tw-text-xs">{{ field.description[$i18n.locale]}}</div>
                    </div>
                </div>
                <div class="tw-bg-gray-200 tw-rounded-md tw-p-2">Date & Time Inputs</div>
                <div class="tw-px-2">
                    <div class="fieldbox" v-for="field in dtFields">
                        <h2 class="tw-font-medium">{{ cleanName(field.name) }}</h2>
                        <div class="tw-text-xs">{{ field.description[$i18n.locale]}}</div>
                    </div>
                </div>
                <div class="tw-bg-gray-200 tw-rounded-md tw-p-2">Selection Inputs</div>
                <div class="tw-px-2">
                    <div class="fieldbox" v-for="field in selectFields">
                        <h2 class="tw-font-medium">{{ cleanName(field.name) }}</h2>
                        <div class="tw-text-xs">{{ field.description[$i18n.locale]}}</div>
                    </div>
                </div>
                <div class="tw-bg-gray-200 tw-rounded-md tw-p-2">Special Inputs</div>
                <div class="tw-px-2">
                    <div class="fieldbox" v-for="field in specialFields">
                        <h2 class="tw-font-medium">{{ cleanName(field.name) }}</h2>
                        <div class="tw-text-xs">{{ field.description[$i18n.locale]}}</div>
                    </div>
                </div>
            </v-card>
        </div>
        <div class="tw-w-9/12 tw-flex-grow">
            <v-card class="tw-p-6">
                RGERGE
            </v-card>
        </div>
    </div>
    </template>
    <Loader v-else/>
</template>

<script setup>
import { usePage } from '@/libs/page';
import { computed, ref } from 'vue';
import Loader from '@/components/globals/Loader.vue';
import { Entries } from '@/libs/graphql/lib/entries';

const page = usePage();
page.setPageTitle('layout.add');

const isReady = ref(false);
const fields = ref([]);

const loadFields = async () =>
{
    fields.value = await Entries.fields();
    isReady.value = true;
}

const inputFields = computed(() => fields.value.filter(f => f.category === 'text'));
const selectFields = computed(() => fields.value.filter(f => f.category === 'select'));
const specialFields = computed(() => fields.value.filter(f => f.category === 'special'));
const dtFields = computed(() => fields.value.filter(f => f.category === 'datetime'));

const cleanName = (name) => name.replace('Field', '');

loadFields();
</script>

<style lang="postcss">
.fieldbox {
    @apply tw-p-2 tw-px-3 hover:tw-bg-primary hover:tw-text-white tw-rounded-md tw-flex tw-flex-col tw-cursor-pointer;
}
</style>
