<template>
    <draggable
        class="dragArea"
        tag="ul"
        :list="categories"
        :group="{ name: 'categories' }"
        item-key="name"
    >
        <template #item="{ element }">
            <li v-if="element.children && element.children.length">
                <div
                    class="tw-flex tw-items-center tw-p-3 tw-rounded"
                    :class="
                        $vuetify.theme.name === 'light'
                            ? 'hover:tw-bg-[#E5E7EB]/20'
                            : 'hover:tw-bg-white/20'
                    "
                >
                    <v-icon icon="mdi-drag" class="tw-mr-2" />
                    <p @click="toggleOpenList(element)" class="tw-w-full">
                        {{ element.name[$i18n.locale] }}
                        <v-icon
                            :icon="
                                isListOpened.includes(element)
                                    ? 'mdi-chevron-down'
                                    : 'mdi-chevron-up'
                            "
                        />
                    </p>

                    <div class="tw-flex tw-gap-2">
                        <v-icon
                            icon="mdi-square-edit-outline"
                            class="tw-hidden"
                            @click="handleEditItem(element)"
                        />
                        <v-icon
                            icon="mdi-trash-can-outline"
                            class="tw-hidden"
                            @click="handleDeleteItem(element)"
                        />
                    </div>
                </div>
                <NestedList
                    v-if="element.children && element.children.length"
                    :categories="element.children"
                    :class="
                        isListOpened.includes(element)
                            ? 'tw-block'
                            : 'tw-hidden'
                    "
                />
            </li>

            <li v-else>
                <div
                    class="tw-flex tw-items-center tw-p-3 tw-rounded"
                    :class="
                        $vuetify.theme.name === 'light'
                            ? 'hover:tw-bg-[#E5E7EB]/20'
                            : 'hover:tw-bg-white/20'
                    "
                >
                    <v-icon icon="mdi-drag" class="tw-mr-2" />
                    <p class="tw-w-full">
                        {{ element.name[$i18n.locale] }}
                    </p>

                    <div class="tw-flex tw-gap-2">
                        <v-icon
                            icon="mdi-square-edit-outline"
                            class="tw-hidden"
                            @click="handleEditItem(element)"
                        />
                        <v-icon
                            icon="mdi-trash-can-outline"
                            class="tw-hidden"
                            @click="handleDeleteItem(element)"
                        />
                    </div>
                </div>
                <NestedList
                    v-if="element.children && element.children.length"
                    :categories="element.children"
                />
            </li>
        </template>
    </draggable>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import draggable from "vuedraggable";
import type { Category } from "@/libs/graphql/types/categories";
import { useI18n } from "vue-i18n";

type Props = {
    categories: Category[];
};
const props = defineProps<Props>();
const i18n = useI18n();
const emitter: any = inject("emitter");

// Return the locale
const getLocale = () => (i18n.locale.value === "en" ? "en" : "fr");

// Open lists having children by default
const isListOpened = ref<Category[]>(
    props.categories.filter((el) => {
        if (el.children && el.children.length) {
            return el;
        }
    })
);

// Toggle Open/Close a list having children
const toggleOpenList = (list: Category) => {
    const categoriesList = isListOpened.value.find(
        (el) => el.name[getLocale()] === list.name[getLocale()]
    );
    if (categoriesList) {
        isListOpened.value = isListOpened.value.filter(
            (el) => el.name[getLocale()] !== list.name[getLocale()]
        );
    } else {
        isListOpened.value.push(list);
    }
};

// Delete a category
const handleDeleteItem = (item: Category) => {
    emitter.emit("delete-item", item);
};

// Edit a category
const handleEditItem = (item: Category) => {
    emitter.emit("edit-item", item);
};
</script>

<style lang="scss" scoped>
ul {
    li {
        @apply tw-cursor-pointer;
        @apply tw-pl-10 tw-py-2;

        div:hover {
            .mdi-trash-can-outline,
            .mdi-square-edit-outline {
                @apply tw-block;
            }
        }
    }
}
</style>
