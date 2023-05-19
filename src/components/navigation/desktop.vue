<template>
    <v-navigation-drawer :rail="!navigationState" color="primary-darker" class="!tw-text-white tw-relative">
        <v-list density="comfortable">
            <v-list-item-media class="tw-max-h-[100px] tw-min-h-[100px]">
                <img
                    :class="{'tw-w-20': navigationState, 'tw-w-10 !tw-mt-3': !navigationState}"
                    class="tw-rounded-md tw-mx-auto tw-transition-all tw-m-4"
                    src="https://mir-s3-cdn-cf.behance.net/user/276/7530587.53f253b5e501a.jpg"
                    alt=""
                />
            </v-list-item-media>

            <v-spacer/>

            <template v-for="(item, i) in navigationItems">
                <v-list-item
                    v-if="hasPermission(item.permission)"
                    :key="i"
                    :value="item"
                    :to="item.to"
                    :active="(item.to && ($route.name === item.to.name) || (item.to && item.to.name === $route.meta.parent))"
                    :title="item.text"
                    active-color="white"
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
import { hasPermission } from '@/libs/tools';
import { useDisplay } from 'vuetify';
import { navigationItems } from '@/components/navigation/navigation';

const display = useDisplay();

defineProps({
    navigationState: {
        type: Boolean,
        default: true
    }
});

</script>
