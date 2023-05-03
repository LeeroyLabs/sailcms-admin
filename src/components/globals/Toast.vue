<template>
    <div
        :class="{'tw-right-2': appStore.toast.show, 'tw-top-4': public, 'tw-top-20': !public, 'tw-right-[-340px] md:tw-right-[-400px]': !appStore.toast.show}"
        class="tw-fixed tw-top-4 tw-bg-white tw-min-h-4 tw-z-99 tw-transition-all tw-duration-500 tw-ease-in-out tw-shadow-lg"
    >
        <v-alert
            :color="(appStore.toast.mode === 'error') ? 'red lighten-2' : 'green lighten-2'"
            :width="$vuetify.display.smAndDown ? 340 : 400"
            :icon="(appStore.toast.mode === 'error') ? '$warning' : '$success'"
            border="start"
            :title="(appStore.toast.mode === 'error') ? $t('system.toast.error') : $t('system.toast.success')"
            variant="tonal"
            density="comfortable"
            rounded
        >
            {{appStore.toast.text}}
        </v-alert>
    </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app";
const appStore = useAppStore();

defineProps({
    public: {
        type: Boolean,
        default: false
    }
});
</script>
