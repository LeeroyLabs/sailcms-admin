<template>
    <div v-if="entry._id !== ''">
        <TabBar :tabs="tabNames" :active="tab" :smallText="true" :stretch="true" @change="(e) => tab=e"/>
        <template v-for="(name, idx) in tabNames">
            <div
                v-if="name !== 'SEO'"
                class="tw-rounded-b-md"
                :class="{
                    'tw-rounded-tr-md': idx === 0, 'tw-rounded-t-md': (idx !== 0 && idx !== 1), 'tw-rounded-tl-md': idx === 1, 'tw-hidden': tab !== idx,
                    'tw-bg-white ': $vuetify.theme.name === 'light', 'tw-bg-darkbg': $vuetify.theme.name === 'dark'
                }"
            >
                <Publication :entry="entry" v-if="idx === 0"/>
                <Revisions v-else/>
            </div>
        </template>
    </div>
</template>

<script setup>
import TabBar from '@/components/globals/Tab.vue';
import Publication from '@/components/entries/entry/Publication.vue';
import Revisions from '@/components/entries/entry/Revisions.vue';
import { useI18n } from 'vue-i18n';
import { computed, ref } from 'vue';

const props = defineProps({
   entry: {
       type: Object,
       default: {}
   }
});

// Use
const i18n = useI18n();

// Variables
const tab = ref(0);

const tabNames = computed(() => [i18n.t('entry.publication'), i18n.t('entry.revisions')]);

</script>
