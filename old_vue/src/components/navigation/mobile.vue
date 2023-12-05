<template>
    <v-navigation-drawer
        :temporary="true"
        color="primary-darker"
        class="!tw-text-white tw-relative"
    >
        <v-list density="comfortable">
            <v-list-item-media class="tw-max-h-[100px] tw-min-h-[100px]">
                <img
                    :class="{
                        'tw-w-20':
                            ($vuetify.display.mdAndUp && navigationState) ||
                            $vuetify.display.mdAndDown,
                        'tw-w-10 !tw-mt-3':
                            !$vuetify.display.mobile && !navigationState,
                    }"
                    class="tw-rounded-md tw-mx-auto tw-transition-all tw-m-4"
                    src="https://mir-s3-cdn-cf.behance.net/user/276/7530587.53f253b5e501a.jpg"
                    alt=""
                />
            </v-list-item-media>

            <v-spacer />

            <template v-for="(item, i) in navigationItems">
                <v-list-item
                    v-if="hasPermission(item.permission)"
                    :key="i"
                    :value="item"
                    :to="item.to"
                    :active="isActive(item)"
                    :title="item.text"
                    color="white"
                >
                    <template v-slot:prepend>
                        <v-icon :icon="item.icon" :alt="item.text"></v-icon>
                    </template>
                </v-list-item>
            </template>
        </v-list>
    </v-navigation-drawer>
</template>

<script setup>
import { hasPermission } from "@/libs/tools";
import { navigationItems } from "@/components/navigation/navigation";
import { computed } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
    navigationState: {
        type: Boolean,
        default: true,
    },
});

const route = useRoute();

const state = computed(() => {
    return props.navigationState;
});

const isActive = (item) =>
{
    if (item.to && route.meta.parent === item.to.name) return true;
    if (route.name === item.parent) return true;
    if (item.to && route.name === item.to.name) return true;
    if (route.meta.isEntries !== undefined && route.meta.isEntries === item.isEntries) return true;

    return false;
}
</script>
