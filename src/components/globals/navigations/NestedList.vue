<template>
    <ul v-if="navStructure && navStructure.length">
        <li
            v-for="item in navStructure"
            :key="item.label"
            class="tw-flex tw-p-3"
        >
            <div
                class="list-item--content"
                :class="
                    $vuetify.theme.name === 'light'
                        ? 'hover:tw-bg-[#E5E7EB]/20'
                        : 'hover:tw-bg-white/20'
                "
            >
                <p>{{ item.label }}</p>
                <div class="action">
                    <span
                        class="action-edit mdi mdi-square-edit-outline"
                        @click="$emit('edit-item', item)"
                    >
                    </span>
                    <span
                        class="action-delete mdi mdi-trash-can-outline tw-text-red-600"
                        @click="$emit('delete-item', item)"
                    >
                    </span>
                </div>
            </div>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { NavigationItem } from "@/libs/graphql/types/navigations";

interface Props {
    navStructure: NavigationItem[];
}
defineProps<Props>();
</script>

<style lang="scss" scoped>
.list-item--content {
    @apply tw-w-full tw-relative tw-p-2 tw-rounded;

    &:hover {
        .action-edit,
        .action-delete {
            @apply tw-block;
        }
    }

    .action {
        @apply tw-flex tw-items-center tw-gap-2;
        @apply tw-absolute tw-top-2/4 tw-right-2 tw--translate-y-2/4;

        &-edit {
            @apply tw-cursor-pointer tw-hidden;
            font: normal normal normal 24px/1 "Material Design Icons";
        }

        &-delete {
            @apply tw-cursor-pointer tw-hidden;
            font: normal normal normal 24px/1 "Material Design Icons";
        }
    }
}
</style>
