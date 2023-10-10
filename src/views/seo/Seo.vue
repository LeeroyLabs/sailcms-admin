<template>
    <div>
        <section class="tw-mt-6 tw-mb-4">
            <v-container class="tw-m-0 tw-p-0" :fluid="true">
                <TabBar
                    :tabs="tabs.map((t) => t.tab)"
                    :active="activeTab"
                    @change="(e) => (activeTab = e)"
                />

                <v-card class="tw-h-[80vh]">
                    <v-row>
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

                            <!-- Content -->
                            <v-window v-model="tab" v-if="activeTab === 1">
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

                            <!-- Settings -->
                            <v-window v-model="tab" v-if="activeTab === 2">
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

                            <!-- Tracking -->
                            <v-window v-model="tab" v-if="activeTab === 3">
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
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import TabBar from "@/components/globals/Tab.vue";

const { t } = useI18n();
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

watch(activeTab, () => (tab.value = tabs[activeTab.value].subTabs[0]));
</script>

<style lang="scss" scoped></style>
