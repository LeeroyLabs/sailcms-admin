<template>
    <v-btn flat icon>
        <v-icon icon="mdi-view-carousel-outline"/>
        <v-tooltip activator="parent"  open-delay="1000" location="top">{{ $t('assets.views.modes') }}</v-tooltip>
        <v-menu transition="scale-transition" activator="parent">
            <v-card class="tw-w-full tw-flex tw-flex-col tw-p-2">
                <div
                    @click.prevent="$emit('change-mode', ['grid'])"
                    class="tw-px-3.5 tw-mb-1 tw-py-2 tw-cursor-pointer hover:tw-bg-gray-100 tw-rounded-md hover:tw-text-black tw-flex tw-flex-row tw-gap-x-2 tw-items-center"
                    :class="{'tw-bg-gray-100 tw-text-black': displayMode === 'grid'}"
                >
                    <v-icon size="16" icon="mdi-view-grid"></v-icon>
                    <span class="tw-text-[14px] tw-font-medium tw-tracking-wider" style="font-family: Roboto, sans-serif">
                        {{ $t('assets.views.grid').toUpperCase() }}
                    </span>
                </div>

                <div
                    @click.prevent="$emit('change-mode', ['compact-grid'])"
                    class="tw-px-3.5 tw-mb-1 tw-py-2 tw-cursor-pointer hover:tw-bg-gray-100 tw-rounded-md hover:tw-text-black tw-flex tw-flex-row tw-gap-x-2 tw-items-center"
                    :class="{'tw-bg-gray-100 tw-text-black': displayMode === 'compact-grid'}"
                >
                    <v-icon size="16" icon="mdi-view-compact-outline"></v-icon>
                    <span class="tw-text-[14px] tw-font-medium tw-tracking-wider" style="font-family: Roboto, sans-serif">
                        {{ $t('assets.views.compact').toUpperCase() }}
                    </span>
                </div>

                <div
                    @click.prevent="$emit('change-mode', ['list'])"
                    class="tw-px-3.5 tw-py-2 tw-cursor-pointer hover:tw-bg-gray-100 tw-rounded-md hover:tw-text-black tw-flex tw-flex-row tw-gap-x-2 tw-items-center"
                    :class="{'tw-bg-gray-100 tw-text-black': displayMode === 'list'}"
                >
                    <v-icon size="16" icon="mdi-format-list-bulleted-type"></v-icon>
                    <span class="tw-text-[14px] tw-font-medium tw-tracking-wider" style="font-family: Roboto, sans-serif">
                        {{ $t('assets.views.list').toUpperCase() }}
                    </span>
                </div>
            </v-card>
        </v-menu>
    </v-btn>
</template>

<script setup lang="ts">
const props = defineProps({
    displayMode: {
        type: String,
        default: 'grid'
    }
});

defineEmits(['change-mode']);
</script>
