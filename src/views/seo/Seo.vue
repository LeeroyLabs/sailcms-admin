<template>
    <div v-if="isReady">
        <Teleport to="#actions">
            <v-btn
                color="primary"
                @click="
                    $router.push({
                        name: 'SeoRedirection',
                        params: { id: 'add' },
                    })
                "
            >
                {{ $t("seo.add_redirection") }}
            </v-btn>
        </Teleport>

        <section class="tw-mt-6 tw-mb-4">
            <v-container class="tw-m-0 tw-p-0" :fluid="true">
                <TabBar
                    :tabs="tabs.map((t) => t.tab)"
                    :active="activeTab"
                    @change="(e) => (activeTab = e)"
                />

                <v-card
                    flat
                    class="tw-h-[80vh]"
                    :class="[
                        { 'tw-rounded-tl-none': activeTab === 0 },
                        { 'tw-rounded-tr-none': activeTab === 3 },
                    ]"
                >
                    <v-row class="tw-p-4 tw-h-full">
                        <v-col
                            cols="12"
                            xs="12"
                            md="3"
                            v-if="tabs[activeTab].subTabs.length"
                        >
                            <v-tabs
                                v-model="tab"
                                :direction="
                                    isLargeScreen ? 'vertical' : 'horizontal'
                                "
                                color="primary"
                            >
                                <v-tab
                                    v-for="item in tabs[activeTab].subTabs"
                                    :key="item"
                                    :value="item"
                                >
                                    {{ item }}
                                </v-tab>
                            </v-tabs>
                        </v-col>

                        <v-col
                            cols="12"
                            xs="12"
                            :md="tabs[activeTab].subTabs.length ? 9 : 12"
                            class="tw-h-full tw-overflow-auto"
                        >
                            <!-- General -->
                            <v-window v-model="tab" v-if="activeTab === 0">
                                <v-window-item
                                    :value="$t('seo.subTabs.appearance')"
                                >
                                    <div
                                        class="tw-flex tw-flex-col tw-gap-4 tw-px-2"
                                    >
                                        <h2 class="tw-font-medium tw-text-xl">
                                            SEO Name
                                        </h2>
                                        <p>
                                            This field is used whenever the name
                                            of the site is referenced, both at
                                            the trailing end of the
                                            &lt;title&gt; tag, and in other meta
                                            tags on the site.
                                        </p>
                                        <v-text-field
                                            label="Label"
                                            variant="outlined"
                                        />
                                        <div class="tw-flex tw-gap-4">
                                            <div
                                                class="tw-basis-2/4 tw-flex tw-flex-col tw-gap-4"
                                            >
                                                <h2
                                                    class="tw-font-medium tw-text-xl"
                                                >
                                                    SEO Name Placement
                                                </h2>
                                                <p class="tw-grow">
                                                    Where the SEO Name is placed
                                                    relative to the Title in the
                                                    &lt;title&gt; tag.
                                                </p>
                                                <v-select
                                                    label="Select"
                                                    :items="[
                                                        $t('seo.before'),
                                                        $t('seo.after'),
                                                    ]"
                                                    density="comfortable"
                                                    class="tw-max-h-[72px]"
                                                />
                                            </div>
                                            <div
                                                class="tw-basis-2/4 tw-flex tw-flex-col tw-gap-4"
                                            >
                                                <h2
                                                    class="tw-font-medium tw-text-xl"
                                                >
                                                    SEO Name Separator
                                                </h2>
                                                <p class="tw-grow">
                                                    The character that should be
                                                    used to separate the SEO
                                                    Name and Title in the
                                                    &lt;title&gt; tag.
                                                </p>
                                                <v-text-field
                                                    label="Label"
                                                    variant="outlined"
                                                    density="comfortable"
                                                    class="tw-max-h-[72px]"
                                                />
                                            </div>
                                        </div>
                                        <h2 class="tw-font-medium tw-text-xl">
                                            SEO Description
                                        </h2>
                                        <p>
                                            SEO descriptions allow you to
                                            influence how your web pages are
                                            described and displayed in search
                                            results. Ensure that all of your web
                                            pages have a unique meta description
                                            that is explicit and contains your
                                            most mportant keywords.
                                        </p>
                                        <v-textarea
                                            label="Label"
                                            variant="outlined"
                                        />
                                        <h2 class="tw-font-medium tw-text-xl">
                                            SEO Keywords
                                        </h2>
                                        <p>
                                            Google ignores SEO keywords tag;
                                            through other search engines do look
                                            at it. Utilize it carefully, as
                                            improper or spammy use most likely
                                            will hurt you, or en have your site
                                            marked as spam.
                                        </p>

                                        <div
                                            class="tw-rounded tw-min-h-[150px] tw-cursor-text tw-px-4 tw-py-2 tw-outline"
                                            :class="keywordClasses"
                                            @click="keywordsInput.focus()"
                                        >
                                            <v-list
                                                class="tw-flex tw-items-start tw-flex-wrap tw-gap-x-2 tw-gap-y-0 tw-p-0"
                                            >
                                                <v-list-item
                                                    v-for="item in selectedKeywords"
                                                    :key="item"
                                                    class="!tw-p-0"
                                                >
                                                    <v-chip
                                                        closable
                                                        @click:close="
                                                            deleteChip(item)
                                                        "
                                                    >
                                                        {{ item }}
                                                    </v-chip>
                                                </v-list-item>
                                                <v-list-item class="!tw-p-0">
                                                    <v-text-field
                                                        ref="keywordsInput"
                                                        v-model="keyword"
                                                        type="text"
                                                        variant="plain"
                                                        hide-details="auto"
                                                        placeholder="Enter your keyword"
                                                        class="keyword-input"
                                                        @keyup.;="createChip"
                                                        @keyup.,="createChip"
                                                        @keyup.enter="
                                                            createChip
                                                        "
                                                    />
                                                </v-list-item>
                                            </v-list>
                                        </div>
                                        <div class="tw-h-5">
                                            <span
                                                v-if="keywordError"
                                                :class="
                                                    $vuetify.theme.name ===
                                                    'dark'
                                                        ? 'tw-text-[#CF6679]'
                                                        : 'tw-text-[#B00020]'
                                                "
                                            >
                                                This keyword is already in the
                                                list
                                            </span>
                                        </div>
                                    </div>
                                </v-window-item>
                                <v-window-item
                                    :value="$t('seo.subTabs.robots')"
                                >
                                    <div
                                        class="tw-flex tw-flex-col tw-gap-4 tw-px-2"
                                    >
                                        <div
                                            class="tw-flex tw-flex-col tw-gap-4"
                                        >
                                            <h2
                                                class="tw-font-medium tw-text-xl"
                                            >
                                                Robots.txt Template
                                            </h2>
                                            <p>
                                                A robots.txt file is a file at
                                                the root of your site that
                                                indicates those parts of your
                                                site you don't want accessed by
                                                search engine crawlers. The file
                                                uses the Robots Exclusion
                                                Standard, which is a protocol
                                                with a small sets of commands
                                                than can be used to indicate
                                                access to your site by section
                                                and by specific kinds of web
                                                crawlers (such as mobile
                                                crawlers vs desktop crawlers).
                                            </p>
                                            <v-textarea
                                                label="Label"
                                                variant="outlined"
                                            />
                                        </div>
                                    </div>
                                </v-window-item>
                                <v-window-item
                                    :value="$t('seo.subTabs.sitemap')"
                                >
                                    <div
                                        class="tw-flex tw-flex-col tw-gap-4 tw-px-2"
                                    >
                                        <div
                                            class="tw-flex tw-flex-col tw-gap-4"
                                        >
                                            <h2
                                                class="tw-font-medium tw-text-xl"
                                            >
                                                Sitemap Enabled
                                            </h2>
                                            <p>
                                                Whether the URL's in this
                                                section should be included in
                                                the sitemap
                                            </p>
                                            <v-switch
                                                color="primary"
                                                :model-value="true"
                                                label="on"
                                            />
                                        </div>
                                    </div>
                                </v-window-item>
                            </v-window>

                            <!-- Social Media -->
                            <v-window v-model="tab" v-else-if="activeTab === 1">
                                <v-window-item
                                    v-for="social in tabs[1].components"
                                    :key="social.name"
                                    :value="social.name"
                                    class="tw-flex tw-flex-col tw-justify-center tw-h-full tw-gap-4 tw-px-2"
                                >
                                    <h2 class="tw-font-medium tw-text-xl">
                                        SEO Preview
                                    </h2>

                                    <div
                                        class="tw-w-full tw-flex tw-justify-center tw-items-center tw-rounded tw-p-6"
                                        :class="{
                                            'tw-bg-white':
                                                $vuetify.theme.name === 'light',
                                            'tw-bg-zinc-900 tw-border tw-border-neutral-500':
                                                $vuetify.theme.name === 'dark',
                                        }"
                                    >
                                        <component
                                            :is="social.component"
                                            :title="socialsData.title"
                                            :description="
                                                socialsData.description
                                            "
                                            :image="selectedURL"
                                        />
                                    </div>

                                    <h2 class="tw-font-medium tw-text-xl">
                                        {{ social.name }} OpenGraph Title Source
                                    </h2>
                                    <v-text-field
                                        label="Label"
                                        variant="outlined"
                                        v-model="socialsData.title"
                                    />

                                    <h2 class="tw-font-medium tw-text-xl">
                                        {{ social.name }} OpenGraph Image Source
                                    </h2>
                                    <v-select
                                        label="Select"
                                        :items="[
                                            $t('seo.before'),
                                            $t('seo.after'),
                                        ]"
                                        density="comfortable"
                                        class="tw-max-h-[72px]"
                                    />

                                    <div
                                        class="tw-flex tw-flex-row tw-gap-x-2 tw-items-center tw-mt-[-10px]"
                                    >
                                        <div
                                            id="seo_image"
                                            class="tw-group tw-w-20 tw-h-20 tw-rounded-md tw-bg-neutral-400 tw-relative tw-mx-auto md:tw-mx-0 tw-bg-center tw-bg-cover"
                                            :style="'background-image: url();'"
                                        >
                                            <div
                                                @click="() => (showAM = true)"
                                                class="tw-cursor-pointer tw-absolute tw-rounded-md tw-h-full tw-w-full tw-bg-black/50 tw-hidden group-hover:tw-flex tw-flex-row tw-items-center tw-justify-center"
                                            >
                                                <v-icon
                                                    icon="mdi-camera"
                                                    color="white"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <template
                                                v-if="selectedFile !== ''"
                                            >
                                                {{ selectedFile }}
                                            </template>
                                            <template v-else>
                                                {{ $t("entryseo.no_image") }}
                                            </template>
                                        </div>
                                    </div>

                                    <h2 class="tw-font-medium tw-text-xl">
                                        {{ social.name }} OpenGraph Image
                                        Description Source
                                    </h2>
                                    <v-text-field
                                        label="Label"
                                        variant="outlined"
                                        v-model="socialsData.description"
                                    />
                                </v-window-item>
                            </v-window>

                            <!-- Preview -->
                            <v-window v-model="tab" v-else-if="activeTab === 2">
                                <v-window-item value=""> </v-window-item>
                            </v-window>

                            <!-- Redirection -->
                            <Manager
                                v-else-if="activeTab === 3"
                                :active="0"
                                :list="redirections.list"
                                :overrideActions="actions"
                                :deleteCallback="handleDeleteForm"
                                :no_items="$t('seo.columns.no_redirections')"
                                :columns="columns"
                                :index="0"
                            >
                                <template v-slot="{ row }">
                                    <td>
                                        {{ row.url }}
                                    </td>
                                    <td>
                                        {{ row.redirect_url }}
                                    </td>
                                    <td>
                                        {{ row.redirect_type }}
                                    </td>
                                    <td>
                                        {{ row.hit_count }}
                                    </td>
                                    <td>
                                        {{
                                            format(
                                                row.last_attempt * 1000,
                                                "dd-MM-yyyy"
                                            )
                                        }}
                                    </td>
                                </template>
                                <template #footer="{ index }">
                                    <v-pagination
                                        v-model="currentPage[index - 1]"
                                        class="tw-mt-6"
                                        density="comfortable"
                                        :rounded="true"
                                        :length="
                                            redirections.pagination.totalPages
                                        "
                                    />
                                </template>
                            </Manager>

                            <!-- Tracking -->
                            <v-window v-model="tab" v-else>
                                <v-window-item
                                    :value="$t('seo.subTabs.google')"
                                >
                                    <div
                                        class="tw-flex tw-flex-col tw-gap-4 tw-px-2"
                                    >
                                        <h2 class="tw-font-medium tw-text-xl">
                                            Google Tag Manager
                                        </h2>
                                        <p>
                                            Google Tag Manager is a tag
                                            management system that allows you to
                                            quickly and easily update tags and
                                            code snippets on your website. Once
                                            the Tag Manager snippet has been
                                            added to your website or mobile app,
                                            you can configure tags via a
                                            web-based user interface without
                                            having to alter and deploy
                                            additional code.
                                        </p>
                                        <v-text-field
                                            label="Label"
                                            variant="outlined"
                                        />
                                    </div>
                                </v-window-item>
                            </v-window>
                        </v-col>
                    </v-row>
                </v-card>
            </v-container>
        </section>
    </div>

    <Loader v-else />

    <Transition>
        <AssetManager
            v-if="showAM"
            :multi="false"
            :cropping="cropping"
            @close="showAM = false"
            @selected="handleSelectedAsset"
        />
    </Transition>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useTheme } from "vuetify";
import { useMediaQuery } from "@vueuse/core";

import { Seo } from "@/libs/graphql/lib/seo.ts";
import { format } from "date-fns";

import TabBar from "@/components/globals/Tab.vue";
import AssetManager from "@/components/globals/AssetManager.vue";
import Manager from "@/components/globals/Manager.vue";
import SERP from "@/components/globals/previews/serp.vue";
import FacebookPreview from "@/components/globals/previews/FacebookPreview.vue";
import LinkedinPreview from "@/components/globals/previews/LinkedinPreview.vue";
import TwitterPreview from "@/components/globals/previews/TwitterPreview.vue";
import Loader from "@/components/globals/Loader.vue";

const { t } = useI18n();
const vuetifyTheme = useTheme();
const isReady = ref(true);
const isLargeScreen = useMediaQuery("(min-width: 960px)");

// Template refs
const keywordsInput = ref(null);

const activeTab = ref(0);
const tabs = [
    {
        tab: t("seo.tabs.general"),
        subTabs: [
            t("seo.subTabs.appearance"),
            t("seo.subTabs.robots"),
            t("seo.subTabs.sitemap"),
        ],
    },
    {
        tab: t("seo.tabs.socials"),
        subTabs: [
            t("seo.subTabs.facebook"),
            t("seo.subTabs.twitter"),
            t("seo.subTabs.linkedin"),
        ],
        components: [
            {
                name: t("seo.subTabs.facebook"),
                component: FacebookPreview,
            },
            {
                name: t("seo.subTabs.twitter"),
                component: TwitterPreview,
            },
            {
                name: t("seo.subTabs.linkedin"),
                component: LinkedinPreview,
            },
        ],
    },
    {
        tab: t("seo.tabs.preview"),
        subTabs: [],
    },
    {
        tab: t("seo.tabs.redirection"),
        subTabs: [],
    },
    {
        tab: t("seo.tabs.tracking"),
        subTabs: [t("seo.subTabs.google")],
    },
];
const tab = ref(tabs[activeTab.value].subTabs[0]);

const socialsData = ref({
    title: "",
    description: "",
    image: "",
    default_image: "",
});

const keyword = ref("");
const selectedKeywords = ref([]);
const keywordError = ref(false);

// Asset Manager
const selectedFile = ref("");
const selectedURL = ref("");
const showAM = ref(false);
const cropping = {
    name: "avatar",
    ratio: 0,
    min: {
        width: 200,
        height: 200,
    },
    max: {
        width: 800,
        height: 800,
    },
    lockedType: "circle",
};

const handleSelectedAsset = (e) => {
    socialsData.value.default_image = e[0]._id;

    const transform = e[0].transforms.find((t) => t.transform === "thumbnail");
    document.getElementById("seo_image").style.backgroundImage =
        "url(" + transform.url + ")";

    selectedURL.value = e[0].url;
    selectedFile.value = e[0].name;
    showAM.value = false;
};

// Computed
const isFocused = computed(
    () => keywordsInput.value && keywordsInput.value.focused
);
const keywordClasses = computed(() => {
    if (
        isFocused.value &&
        keywordError.value &&
        vuetifyTheme.global.name.value === "dark"
    ) {
        return "tw-outline-2 tw-outline-[#CF6679]";
    } else if (
        isFocused.value &&
        keywordError.value &&
        vuetifyTheme.global.name.value === "light"
    ) {
        return "tw-outline-2 tw-outline-[#B00020]";
    } else if (isFocused.value && vuetifyTheme.global.name.value === "dark") {
        return "tw-outline-2 tw-outline-white";
    } else if (isFocused.value && vuetifyTheme.global.name.value === "light") {
        return "tw-outline-2 tw-outline-black";
    } else if (
        keywordError.value &&
        vuetifyTheme.global.name.value === "dark"
    ) {
        return "tw-outline-[#CF6679]";
    } else if (
        keywordError.value &&
        vuetifyTheme.global.name.value === "light"
    ) {
        return "tw-outline-[#B00020]";
    } else if (vuetifyTheme.global.name.value === "dark") {
        return "tw-outline-1 tw-outline-white/[.50] hover:tw-outline-white";
    } else {
        return "tw-outline-1 tw-outline-black/[.30] hover:tw-outline-black";
    }
});

const createChip = () => {
    if (keyword.value !== "") {
        const trimmedKeyword = keyword.value.match(/[\w\s]+/g);
        if (selectedKeywords.value.includes(trimmedKeyword[0])) {
            keywordError.value = true;
            return;
        }
        selectedKeywords.value.push(trimmedKeyword[0]);
        keyword.value = "";
        keywordError.value = false;
        keywordsInput.value.focus();
    }
};

const deleteChip = (keyword) => {
    selectedKeywords.value = selectedKeywords.value.filter(
        (k) => k !== keyword
    );
};

// Redirections
const redirections = ref([]);
const currentPage = ref(1);
const pagination = ref({ total: 0, current: 0, totalPages: 0 });
const columns = ref([
    { label: t("seo.columns.url"), centered: false },
    { label: t("seo.columns.redirect_url"), centered: false },
    { label: t("seo.columns.redirect_type"), centered: false },
    { label: t("seo.columns.hit_count"), centered: false },
    { label: t("seo.columns.last_attempt"), centered: false },
]);

const getRedirections = async (page, limit, search, sort, order) => {
    const result = await Seo.getRedirections(page, limit, search, sort, order);
    if (result) {
        redirections.value = result;
    }
};

watch(activeTab, () => (tab.value = tabs[activeTab.value].subTabs[0]));

onMounted(() => {
    getRedirections(1, 25, "", "url", "ASC");
});
</script>

<style lang="scss" scoped>
.keyword-input {
    @apply tw-w-[200px];
    :deep(input) {
        padding-top: 0px !important;
    }
}
</style>
