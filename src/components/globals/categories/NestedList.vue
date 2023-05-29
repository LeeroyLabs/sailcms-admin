<template>
    <draggable
        class="dragArea"
        tag="ul"
        :list="categories"
        :group="{ name: 'categories' }"
        item-key="id"
        @end="selectedCategory = $event.item._underlying_vm_"
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
                    :categories="element.children || []"
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
                <NestedList :categories="element.children || []" />
            </li>
        </template>
    </draggable>
</template>

<script setup lang="ts">
import { ref, inject, watch } from "vue";
import draggable from "vuedraggable";
import type { Category } from "@/libs/graphql/types/categories";
import { Categories } from "@/libs/graphql";
import { useI18n } from "vue-i18n";
import { SailCMS } from "@/libs/graphql";

type Props = {
    categories: Category[];
};
const props = defineProps<Props>();
const i18n = useI18n();
const emitter: any = inject("emitter");
const siteId = ref(SailCMS.getSiteId());

// Return the locale
const getLocale = () => (i18n.locale.value === "en" ? "en" : "fr");

// Open lists having children by default
const openList = (array: Category[]) => {
    const openCategoriesList = array.filter((el) => {
        if (el.children && el.children.length) {
            openList(el.children);
        }
        return el;
    });
    return openCategoriesList;
};

const isListOpened = ref<Category[]>(openList(props.categories));
const selectedCategory = ref<Category>();

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

// Update category orders & parent id
const updateCategoryOrders = async (categories: Category[]) => {
    const categoriesId = categories.map((cat) => cat._id);
    const parentId = categories.find(
        (cat) => cat.parent_id !== selectedCategory.value?.parent_id
    )?.parent_id;

    const responseUpdateCategoryOrders = await Categories.updateCategoryOrders(
        parentId || "",
        categoriesId,
        siteId.value
    );
    if (responseUpdateCategoryOrders) {
        console.log("UPDATED");
    }
};

watch(props.categories, (newValue) => {
    updateCategoryOrders(newValue);
});
</script>

<style lang="scss" scoped>
.dragArea {
    min-height: 50px;
    outline: 1px dashed;
}
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
