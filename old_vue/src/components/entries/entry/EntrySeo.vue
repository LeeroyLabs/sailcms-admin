<template>
    <div v-if="ready" class="tw-flex tw-flex-col tw-gap-y-6">

        <div class="tw-flex tw-flex-row tw-w-full">
            <v-tabs
                v-model="tab"
                direction="vertical"
                color="primary"
                class="tw-rounded-l-lg tw-w-[170px]"
                :class="{
                    'tw-bg-gray-200 tw-border-neutral-400': $vuetify.theme.name === 'light',
                    'tw-bg-neutral-800 tw-border tw-border-neutral-500': $vuetify.theme.name === 'dark',
                    'tw-border': alwaysShowBorders,
                    '!tw-bg-gray-300': alwaysShowBorders && $vuetify.theme.name === 'light'
                }"
            >
                <v-tab value="info">
                    <v-icon :start="true">
                        mdi-information-outline
                    </v-icon>
                    {{ $t('entryseo.info') }}
                </v-tab>
                <v-tab value="robots">
                    <v-icon :start="true">
                        mdi-robot-outline
                    </v-icon>
                    {{ $t('entryseo.robots') }}
                </v-tab>
                <v-tab value="sitemap">
                    <v-icon :start="true">
                        mdi-map-check-outline
                    </v-icon>
                    {{ $t('entryseo.sitemap') }}
                </v-tab>
            </v-tabs>

            <v-window
                v-model="tab"
                class="tw-w-full tw-p-4 tw-min-h-[300px] tw-max-h-[300px] tw-rounded-r-lg"
                :class="{
                    'tw-bg-white tw-border-neutral-400 tw-border-l-0': $vuetify.theme.name === 'light',
                    'tw-bg-zinc-900 tw-border tw-border-neutral-500': $vuetify.theme.name === 'dark',
                    'tw-border': alwaysShowBorders
                }"
            >
                <v-window-item value="info">
                    <div class="tw-flex tw-flex-col tw-gap-y-4">
                        <v-text-field
                            variant="outlined"
                            color="primary"
                            density="comfortable"
                            label="Title"
                            type="text"
                            :hide-details="true"
                            v-model="seoData.title"
                            @input="() => titleEdited = true"
                            autocomplete="new-password"
                        />

                        <v-textarea
                            :counter="true"
                            variant="outlined"
                            color="primary"
                            density="comfortable"
                            label="Description"
                            :rules="[rules.limit]"
                            v-model="seoData.description"
                            :max-rows="3"
                            :rows="3"
                            no-resize
                            auto-grow
                            autocomplete="new-password"
                        />

                        <div class="tw-flex tw-flex-row tw-gap-x-2 tw-items-center tw-mt-[-10px]">
                            <div id="seo_image" class="tw-group tw-w-20 tw-h-20 tw-rounded-md tw-bg-neutral-400 tw-relative tw-mx-auto md:tw-mx-0 tw-bg-center tw-bg-cover" :style="'background-image: url();'">
                                <div @click="() => showAM = true" class="tw-cursor-pointer tw-absolute tw-rounded-md tw-h-full tw-w-full tw-bg-black/50 tw-hidden group-hover:tw-flex tw-flex-row tw-items-center tw-justify-center">
                                    <v-icon icon="mdi-camera" color="white"/>
                                </div>
                            </div>
                            <div>
                                <template v-if="selectedFile !== ''">
                                    {{ selectedFile }}
                                </template>
                                <template v-else>
                                    {{ $t('entryseo.no_image') }}
                                </template>
                            </div>
                        </div>
                    </div>
                </v-window-item>
                <v-window-item value="robots">
                    <div>
                        <v-autocomplete
                            :chips="true"
                            color="primary"
                            label=""
                            v-model="seoData.robots.meta"
                            :items="[
                                'all', 'nofollow', 'noindex', 'none', 'noarchive', 'indexifembedded', 'max-snippet:0',
                                'max-snippet:-1', 'max-snippet:5', 'max-snippet:10', 'max-snippet:20', 'nosnippet',
                                'max-image-preview:standard', 'max-image-preview:none', 'max-image-preview:large',
                                'no-translate', 'noimageindex', 'max-video-preview:-1', 'max-video-preview:1', 'max-video-preview:0',
                                'nositelinksearchbox'
                            ]"
                            :multiple="true"
                            variant="outlined"
                        ></v-autocomplete>

                        <Date :showFloatingLabel="true" :config="dtConfig" v-model="seoData.robots.expire_after"/>
                        <small>{{ $t('entryseo.date_explain') }}</small>
                    </div>
                </v-window-item>
                <v-window-item value="sitemap">
                    <div class="tw-flex tw-flex-col tw-gap-y-4">
                        <div class="tw-flex tw-flex-row tw-justify-start tw-gap-x-2">
                            <v-switch :color="($vuetify.theme.name === 'dark') ? 'light-green-accent-3' : 'green'" v-model="seoData.sitemap.enabled" label="Add this entry to the global sitemap" :hide-details="true"/>
                        </div>

                        <v-select
                            :label="$t('entryseo.frequency')"
                            :hide-details="true"
                            v-model="seoData.sitemap.frequency"
                            color="primary"
                            :items="frequencies"
                            variant="outlined"
                            density="comfortable"
                            :persistent-hint="false"
                            class="tw-w-full tw-mb-2"
                        />

                        <v-select
                            :label="$t('entryseo.priority')"
                            :hide-details="true"
                            v-model="seoData.sitemap.priority"
                            color="primary"
                            :items="priorities"
                            variant="outlined"
                            density="comfortable"
                            :persistent-hint="false"
                            class="tw-w-full"
                        />
                    </div>
                </v-window-item>
            </v-window>
        </div>

        <div v-if="showPreview">
            <h2 class="tw-text-neutral-500 tw-font-medium tw-text-lg tw-mb-2">{{ $t('entryseo.previews') }}</h2>

            <div class="tw-flex tw-flex-row tw-w-full">
                <v-tabs v-model="activePreview" direction="vertical" color="primary" class="tw-rounded-l-lg tw-w-[170px]" :class="{'tw-bg-gray-200': $vuetify.theme.name === 'light', 'tw-bg-neutral-800 tw-border tw-border-neutral-500': $vuetify.theme.name === 'dark'}">
                    <v-tab value="serp">
                        <v-icon :start="true">
                            mdi-google
                        </v-icon>
                        {{ $t('entryseo.search') }}
                    </v-tab>
                    <v-tab value="facebook">
                        <v-icon :start="true">
                            mdi-facebook
                        </v-icon>
                        Facebook
                    </v-tab>
                    <v-tab value="x">
                        <v-icon :start="true">
                            mdi-twitter
                        </v-icon>
                        X/Twitter
                    </v-tab>
                    <v-tab value="linkedin">
                        <v-icon :start="true">
                            mdi-linkedin
                        </v-icon>
                        LinkedIn
                    </v-tab>
                </v-tabs>

                <v-window v-model="activePreview" class="tw-w-full tw-min-h-[420px] tw-h-[420px] tw-max-h-[420px] tw-rounded-r-lg" :class="{'tw-bg-white': $vuetify.theme.name === 'light', 'tw-bg-zinc-900 tw-border tw-border-neutral-500': $vuetify.theme.name === 'dark'}">
                    <v-window-item value="serp" class="tw-flex tw-flex-row tw-items-center tw-justify-center tw-h-full">
                        <SERP
                            :title="seoData.title"
                            :urlPrefix="entryType.url_prefix[$i18n.locale]"
                            :description="seoData.description"
                            :url="entry.slug"
                            :robotsAllowed="areBotsAllowed"
                        />
                    </v-window-item>
                    <v-window-item value="facebook" class="tw-flex tw-flex-row tw-items-center tw-justify-center tw-h-full">
                        <FacebookPreview :title="seoData.title" :description="seoData.description" :image="selectedURL" />
                    </v-window-item>
                    <v-window-item value="x" class="tw-flex tw-flex-row tw-items-center tw-justify-center tw-h-full">
                        <TwitterPreview :title="seoData.title" :description="seoData.description" :image="selectedURL"/>
                    </v-window-item>
                    <v-window-item value="linkedin" class="tw-flex tw-flex-row tw-items-center tw-justify-center tw-h-full">
                        <LinkedinPreview :title="seoData.title" :description="seoData.description" :image="selectedURL"/>
                    </v-window-item>
                </v-window>
            </div>
        </div>
    </div>
    <div v-else class="tw-relative tw-my-[150px]">
        <Loader :full="false"/>
    </div>

    <Transition>
        <AssetManager v-if="showAM" :multi="false" :cropping="cropping" @close="showAM=false" @selected="handleSelectedAsset" />
    </Transition>
</template>

<script setup>
import SERP from "@/components/globals/previews/serp.vue";
import Loader from '@/components/globals/Loader.vue';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AssetManager from '@/components/globals/AssetManager.vue';
import FacebookPreview from '@/components/globals/previews/FacebookPreview.vue';
import LinkedinPreview from '@/components/globals/previews/LinkedinPreview.vue';
import TwitterPreview from '@/components/globals/previews/TwitterPreview.vue';
import { SailCMS } from '@/libs/graphql';
import Date from '@/components/entries/entry/fields/Date.vue';

const props = defineProps({
    entry: {
        type: Object,
        default: null
    },
    entryType: {
        type: Object,
        default: null
    },
    showPreview: {
        type: Boolean,
        default: true
    },
    isEntryType: {
        type: Boolean,
        default: false
    },
    alwaysShowBorders: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['change']);
const i18n = useI18n();
const ready = ref(false);
const titleEdited = ref(false);
const showAM = ref(false);
const selectedFile = ref('');
const selectedURL = ref('');
const activePreview = ref('serp');
const tab = ref('info');

const rules = {
    required: value => !!value || i18n.t('login.errors.required'),
    limit: v => v.length <= 250 || i18n.t('entryseo.maxchars')
}

const frequencies = ref([
    {value: 'daily', title: 'Daily'},
    {value: 'weekly', title: 'Weekly'},
    {value: 'monthly', title: 'Monthly'},
    {value: 'yearly', title: 'Yearly'},
    {value: 'hourly', title: 'Hourly'},
    {value: 'always', title: 'Always'},
    {value: 'never', title: 'Never'}
]);

const priorities = ref([
    {value: '1.0', title: i18n.t('entryseo.priorities.xhigh')},
    {value: '0.8', title: 'High'},
    {value: '0.5', title: 'Regular'},
    {value: '0.3', title: 'Low'},
    {value: '0.1', title: 'Extremely Low'}
]);

const seoData = ref({
    title: '',
    description: '',
    image: '',
    robots: {
        meta: 'all',
        expire_after: ''
    },
    sitemap: {
        enabled: true,
        priority: '0.5',
        frequency: 'monthly'
    },
    alternates: [],
    url: '',
    locale: SailCMS.getLocales()[0],
    default_image: '',
    social_metas: [],
    keywords: ''
});

const dtConfig = {
    type: '',
    label: {en: 'Content is unavailable after', fr: 'Contenu non disponible après'},
    name: '',
    validation: '',
    required: false,
    repeatable: false,
    config: {
        range: false,
        date_format: 'Y-m-d'
    },
    width: 'full'
};

const loadEntrySeo = async () =>
{
    if (props.showPreview) {
        if (props.entry._id==='') {
            ready.value = true;
            return;
        }
    }

    if (props.isEntryType) {
        console.log("entry type code");
        ready.value = true;
        return;
    }
}

const areBotsAllowed = computed(() =>
{
    return (!seoData.value.robots.meta.includes('noindex') && !seoData.value.robots.meta.includes('none'));
});

const handleSelectedAsset = (e) =>
{
    seoData.value.default_image = e[0]._id;

    const transform = e[0].transforms.find(t => t.transform === 'thumbnail');
    document.getElementById('seo_image').style.backgroundImage = 'url(' + transform.url + ')';

    selectedURL.value = e[0].url;
    selectedFile.value = e[0].name;
    showAM.value = false;
}

watch(props.entry, (v) =>
{
    if (!titleEdited.value) {
        seoData.value.title = v.title;
    }
});

watch(seoData.value, v =>
{
    emit('change', v);
});

loadEntrySeo();

/**
 *
 * Features
 *
 * ✅ Preview (copy css from https://mesoptier.github.io/react-serp-preview/)
 * Meta Title (character count to max 250)
 * ✅ Description
 * Meta Image (show preview for Faceboook and X)
 * ✅ Robots tag (index, noindex, nofollow, noarchive, noimageindex, nositelinkssearchbox, nosnippet, max-snippet, max-image-preview, max-video-preview, Unavailable_after)
 * Sitemap yes/no
 * Canonical
 *
 *
 *
 *
 * META CHECKS FOR INDEX, AND NO VALUES
 * -------
 * MAX SNIPPET VALUE
 * MAX VIDEO PREVIEW VALUE
 * MAX IMAGE PREVIEW VALUE
 *
 *
 */
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

.preview-button {
    @apply hover:tw-bg-primary hover:tw-text-white tw-py-3 tw-pl-2 tw-pr-4 tw-flex tw-flex-row tw-gap-x-2;
}

.preview-button.top {
    @apply tw-rounded-tl-lg;
}
</style>