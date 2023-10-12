<template>
    <div v-if="isReady">
        <section class="tw-mt-6 tw-mb-4">
            <v-container class="tw-m-0 tw-p-0" :fluid="true">
                <TabBar
                    :tabs="tabs.map((t) => t.tab)"
                    :active="activeTab"
                    @change="(e) => (activeTab = e)"
                />

                <v-card
                    flat
                    class="tw-h-[80vh] tw-overflow-auto"
                    :class="[
                        { 'tw-rounded-tl-none': activeTab === 0 },
                        { 'tw-rounded-tr-none': activeTab === 3 },
                    ]"
                >
                    <v-row class="tw-p-4">
                        <v-col cols="12" xs="12" md="3">
                            <v-tabs
                                v-model="tab"
                                direction="vertical"
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

                        <v-col cols="12" xs="12" md="9">
                            <!-- General -->
                            <v-window v-model="tab" v-if="activeTab === 0">
                                <v-window-item
                                    :value="$t('seo.subTabs.appearance')"
                                >
                                    <v-card flat>
                                        <v-card-text
                                            class="tw-flex tw-flex-col tw-gap-4 tw-pb-6"
                                        >
                                            <h2
                                                class="tw-font-medium tw-text-xl"
                                            >
                                                Site SEO Name
                                            </h2>
                                            <p>
                                                This field is used whenever the
                                                name of the site is referenced,
                                                both at the trailing end of the
                                                &lt;title&gt; tag, and in other
                                                meta tags on the site.
                                            </p>
                                            <v-text-field
                                                label="Label"
                                                variant="outlined"
                                            />
                                            <div class="tw-flex tw-gap-4">
                                                <div
                                                    class="tw-flex tw-flex-col tw-gap-4"
                                                >
                                                    <h2
                                                        class="tw-font-medium tw-text-xl"
                                                    >
                                                        Site SEO Name Placement
                                                    </h2>
                                                    <p>
                                                        SEO descriptions allow
                                                        you to influence how
                                                        your web pages are
                                                        described and displayed
                                                        in search results.
                                                        Ensure that all of your
                                                        web pages have a unique
                                                        meta description that is
                                                        explicit and contains
                                                        your most mportant
                                                        keywords.
                                                    </p>
                                                    <v-select
                                                        label="Select"
                                                        :items="[
                                                            $t('seo.before'),
                                                            $t('seo.after'),
                                                        ]"
                                                    />
                                                </div>
                                                <div
                                                    class="tw-flex tw-flex-col tw-gap-4"
                                                >
                                                    <h2
                                                        class="tw-font-medium tw-text-xl"
                                                    >
                                                        Site SEO Name Separator
                                                    </h2>
                                                    <p>
                                                        SEO descriptions allow
                                                        you to influence how
                                                        your web pages are
                                                        described and displayed
                                                        in search results.
                                                        Ensure that all of your
                                                        web pages have a unique
                                                        meta description that is
                                                        explicit and contains
                                                        your most mportant
                                                        keywords.
                                                    </p>
                                                    <v-text-field
                                                        label="Label"
                                                        variant="outlined"
                                                    />
                                                </div>
                                            </div>
                                            <h2
                                                class="tw-font-medium tw-text-xl"
                                            >
                                                SEO Description
                                            </h2>
                                            <p>
                                                SEO descriptions allow you to
                                                influence how your web pages are
                                                described and displayed in
                                                search results. Ensure that all
                                                of your web pages have a unique
                                                meta description that is
                                                explicit and contains your most
                                                mportant keywords.
                                            </p>
                                            <v-textarea
                                                label="Label"
                                                variant="outlined"
                                            />
                                            <h2
                                                class="tw-font-medium tw-text-xl"
                                            >
                                                SEO Keywords
                                            </h2>
                                            <p>
                                                Google ignores SEO keywords tag;
                                                through other search engines do
                                                look at it. Utilize it
                                                carefully, as improper or spammy
                                                use most likely will hurt you,
                                                or en have your site marked as
                                                spam.
                                            </p>

                                            <div
                                                class="tw-rounded tw-min-h-[150px] tw-cursor-text tw-px-4 tw-py-2 tw-outline"
                                                :class="inputClasses"
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
                                                    <v-list-item
                                                        class="!tw-p-0"
                                                    >
                                                        <v-text-field
                                                            ref="keywordsInput"
                                                            v-model="keyword"
                                                            type="text"
                                                            variant="plain"
                                                            hide-details="auto"
                                                            placeholder="Enter your keyword"
                                                            class="keyword-input"
                                                            @keyup.;="
                                                                createChip
                                                            "
                                                            @keyup.,="
                                                                createChip
                                                            "
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
                                                    This keyword is already in
                                                    the list
                                                </span>
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-window-item>
                                <v-window-item
                                    :value="$t('seo.subTabs.social_media')"
                                >
                                    <v-card flat>
                                        <v-card-text>
                                            <p>
                                                Morbi nec metus. Suspendisse
                                                faucibus, nunc et pellentesque
                                                egestas, lacus ante convallis
                                                tellus, vitae iaculis lacus elit
                                                id tortor. Sed mollis, eros et
                                                ultrices tempus, mauris ipsum
                                                aliquam libero, non adipiscing
                                                dolor urna a orci. Curabitur
                                                ligula sapien, tincidunt non,
                                                euismod vitae, posuere
                                                imperdiet, leo. Nunc sed turpis.
                                            </p>
                                        </v-card-text>
                                    </v-card>
                                </v-window-item>
                                <v-window-item
                                    :value="$t('seo.subTabs.robots')"
                                >
                                    <v-card flat>
                                        <v-card-text
                                            class="tw-flex tw-flex-col tw-gap-4"
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
                                                    A robots.txt file is a file
                                                    at the root of your site
                                                    that indicates those parts
                                                    of your site you don't want
                                                    accessed by search engine
                                                    crawlers. The file uses the
                                                    Robots Exclusion Standard,
                                                    which is a protocol with a
                                                    small sets of commands than
                                                    can be used to indicate
                                                    access to your site by
                                                    section and by specific
                                                    kinds of web crawlers (such
                                                    as mobile crawlers vs
                                                    desktop crawlers).
                                                </p>
                                                <v-textarea
                                                    label="Label"
                                                    variant="outlined"
                                                />
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-window-item>
                            </v-window>

                            <!-- Content -->
                            <v-window v-model="tab" v-else-if="activeTab === 1">
                                <v-window-item
                                    :value="$t('seo.subTabs.appearance')"
                                >
                                    <v-card flat>
                                        <v-card-text
                                            class="tw-flex tw-flex-col tw-gap-4 tw-pb-6"
                                        >
                                        </v-card-text>
                                    </v-card>
                                </v-window-item>
                                <v-window-item
                                    :value="$t('seo.subTabs.social_media')"
                                >
                                    <v-card flat>
                                        <v-card-text>
                                            <p>
                                                Morbi nec metus. Suspendisse
                                                faucibus, nunc et pellentesque
                                                egestas, lacus ante convallis
                                                tellus, vitae iaculis lacus elit
                                                id tortor. Sed mollis, eros et
                                                ultrices tempus, mauris ipsum
                                                aliquam libero, non adipiscing
                                                dolor urna a orci. Curabitur
                                                ligula sapien, tincidunt non,
                                                euismod vitae, posuere
                                                imperdiet, leo. Nunc sed turpis.
                                            </p>
                                        </v-card-text>
                                    </v-card>
                                </v-window-item>
                                <v-window-item
                                    :value="$t('seo.subTabs.robots')"
                                >
                                    <v-card flat>
                                        <v-card-text>
                                            <p>
                                                Fusce a quam. Phasellus nec sem
                                                in justo pellentesque facilisis.
                                                Nam eget dui. Proin viverra,
                                                ligula sit amet ultrices semper,
                                                ligula arcu tristique sapien, a
                                                accumsan nisi mauris ac eros. In
                                                dui magna, posuere eget,
                                                vestibulum et, tempor auctor,
                                                justo.
                                            </p>
                                        </v-card-text>
                                    </v-card>
                                </v-window-item>
                                <v-window-item
                                    :value="$t('seo.subTabs.site_map')"
                                >
                                    <v-card flat>
                                        <v-card-text
                                            class="tw-flex tw-flex-col tw-gap-4 tw-pb-6"
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
                                                    section should be included
                                                    in the sitemap
                                                </p>
                                                <v-switch
                                                    color="primary"
                                                    :model-value="true"
                                                    label="on"
                                                />
                                            </div>
                                            <div
                                                class="tw-flex tw-flex-col tw-gap-4"
                                            >
                                                <h2
                                                    class="tw-font-medium tw-text-xl"
                                                >
                                                    Change Frequency
                                                </h2>
                                                <p>
                                                    How frequently the page is
                                                    likely to change. This value
                                                    provides general information
                                                    to search engines and may
                                                    not correlate exactly to how
                                                    often they crawl the page.
                                                </p>
                                                <v-select
                                                    label="Select"
                                                    :items="[
                                                        'Daily',
                                                        'Weekly',
                                                        'Monthly',
                                                    ]"
                                                    variant="outlined"
                                                />
                                            </div>
                                            <div
                                                class="tw-flex tw-flex-col tw-gap-4"
                                            >
                                                <h2
                                                    class="tw-font-medium tw-text-xl"
                                                >
                                                    Priority
                                                </h2>
                                                <p>
                                                    The priority of this URL
                                                    relative to other URLs on
                                                    your site. This value does
                                                    not affect how your pages
                                                    are compared to pages on
                                                    other sites. It only lets
                                                    the search engines know
                                                    which pages you deem most
                                                    important for the crawlers.
                                                </p>
                                                <v-select
                                                    label="Select"
                                                    :items="['0.5', '0.8', '1']"
                                                    variant="outlined"
                                                />
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-window-item>
                            </v-window>

                            <!-- Settings -->
                            <v-window v-model="tab" v-else-if="activeTab === 2">
                                <v-window-item
                                    :value="$t('seo.subTabs.appearance')"
                                >
                                    <v-card flat>
                                        <v-card-text
                                            class="tw-flex tw-flex-col tw-gap-4 tw-pb-6"
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
                                                    section should be included
                                                    in the sitemap
                                                </p>
                                                <v-switch
                                                    color="primary"
                                                    :model-value="true"
                                                    label="on"
                                                />
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-window-item>
                                <v-window-item
                                    :value="$t('seo.subTabs.social_media')"
                                >
                                    <v-card flat>
                                        <v-card-text>
                                            <p>
                                                Morbi nec metus. Suspendisse
                                                faucibus, nunc et pellentesque
                                                egestas, lacus ante convallis
                                                tellus, vitae iaculis lacus elit
                                                id tortor. Sed mollis, eros et
                                                ultrices tempus, mauris ipsum
                                                aliquam libero, non adipiscing
                                                dolor urna a orci. Curabitur
                                                ligula sapien, tincidunt non,
                                                euismod vitae, posuere
                                                imperdiet, leo. Nunc sed turpis.
                                            </p>
                                        </v-card-text>
                                    </v-card>
                                </v-window-item>
                                <v-window-item
                                    :value="$t('seo.subTabs.robots')"
                                >
                                    <v-card flat>
                                        <v-card-text>
                                            <p>
                                                Fusce a quam. Phasellus nec sem
                                                in justo pellentesque facilisis.
                                                Nam eget dui. Proin viverra,
                                                ligula sit amet ultrices semper,
                                                ligula arcu tristique sapien, a
                                                accumsan nisi mauris ac eros. In
                                                dui magna, posuere eget,
                                                vestibulum et, tempor auctor,
                                                justo.
                                            </p>
                                        </v-card-text>
                                    </v-card>
                                </v-window-item>
                            </v-window>

                            <!-- Tracking -->
                            <v-window v-model="tab" v-else>
                                <v-window-item
                                    :value="$t('seo.subTabs.appearance')"
                                >
                                    <v-card flat>
                                        <v-card-text
                                            class="tw-flex tw-flex-col tw-gap-4"
                                        >
                                            <p>
                                                Sed aliquam ultrices mauris.
                                                Donec posuere vulputate arcu.
                                                Morbi ac felis. Etiam feugiat
                                                lorem non metus. Sed a libero.
                                            </p>
                                            <v-select
                                                label="Select"
                                                :items="[
                                                    $t('seo.before'),
                                                    $t('seo.after'),
                                                ]"
                                            />
                                        </v-card-text>
                                    </v-card>
                                </v-window-item>
                                <v-window-item
                                    :value="$t('seo.subTabs.social_media')"
                                >
                                    <v-card flat>
                                        <v-card-text>
                                            <p>
                                                Morbi nec metus. Suspendisse
                                                faucibus, nunc et pellentesque
                                                egestas, lacus ante convallis
                                                tellus, vitae iaculis lacus elit
                                                id tortor. Sed mollis, eros et
                                                ultrices tempus, mauris ipsum
                                                aliquam libero, non adipiscing
                                                dolor urna a orci. Curabitur
                                                ligula sapien, tincidunt non,
                                                euismod vitae, posuere
                                                imperdiet, leo. Nunc sed turpis.
                                            </p>
                                        </v-card-text>
                                    </v-card>
                                </v-window-item>
                                <v-window-item
                                    :value="$t('seo.subTabs.robots')"
                                >
                                    <v-card flat>
                                        <v-card-text>
                                            <p>
                                                Fusce a quam. Phasellus nec sem
                                                in justo pellentesque facilisis.
                                                Nam eget dui. Proin viverra,
                                                ligula sit amet ultrices semper,
                                                ligula arcu tristique sapien, a
                                                accumsan nisi mauris ac eros. In
                                                dui magna, posuere eget,
                                                vestibulum et, tempor auctor,
                                                justo.
                                            </p>
                                        </v-card-text>
                                    </v-card>
                                </v-window-item>
                            </v-window>
                        </v-col>
                    </v-row>
                </v-card>
            </v-container>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useTheme } from "vuetify";
import TabBar from "@/components/globals/Tab.vue";

const { t } = useI18n();
const vuetifyTheme = useTheme();
const isReady = ref(true);
const activeTab = ref(0);
const tabs = [
    {
        tab: t("seo.tabs.general"),
        subTabs: [
            t("seo.subTabs.appearance"),
            t("seo.subTabs.social_media"),
            t("seo.subTabs.robots"),
        ],
    },
    {
        tab: t("seo.tabs.content"),
        subTabs: [
            t("seo.subTabs.appearance"),
            t("seo.subTabs.social_media"),
            t("seo.subTabs.robots"),
            t("seo.subTabs.site_map"),
        ],
    },
    {
        tab: t("seo.tabs.settings"),
        subTabs: [],
    },
    {
        tab: t("seo.tabs.tracking"),
        subTabs: [],
    },
];
const tab = ref(tabs[activeTab.value].subTabs[0]);

const keyword = ref("");
const selectedKeywords = ref([]);
const keywordError = ref(false);
const isFocused = computed(
    () => keywordsInput.value && keywordsInput.value.focused
);
const inputClasses = computed(() => {
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

// Template refs
const keywordsInput = ref(null);

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

watch(activeTab, () => (tab.value = tabs[activeTab.value].subTabs[0]));
</script>

<style lang="scss" scoped>
.keyword-input {
    @apply tw-w-[200px];
    :deep(input) {
        padding-top: 0px !important;
    }
}
</style>
