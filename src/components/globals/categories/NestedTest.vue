<template>
    <draggable
        class="dragArea"
        tag="ul"
        :list="categoriesList"
        :group="{ name: 'categories' }"
        item-key="id"
        @end="sortCategoriesList"
    >
        <template #item="{ element }">
            <li
                v-if="element.children && element.children.length"
                :data-id="element._id"
            >
                {{ element._id }}
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
                    v-model:categories="element.children"
                    :class="
                        isListOpened.includes(element)
                            ? 'tw-block'
                            : 'tw-hidden'
                    "
                />
            </li>

            <li v-else :data-id="element._id">
                {{ element._id }}
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
                <NestedList v-model:categories="element.children" />
            </li>
        </template>
    </draggable>
</template>

<script setup lang="ts">
import { ref, inject, watch } from "vue";
import draggable from "vuedraggable";
import type { Category } from "@/libs/graphql/types/categories";
import { Categories } from "@/libs/graphql";
import { SailCMS } from "@/libs/graphql";

type Props = {
    categories?: Category[];
};
const props = defineProps<Props>();
const emitter: any = inject("emitter");
const siteId = ref(SailCMS.getSiteId());

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

const categoriesList = ref(props.categories || []);
const selectedCategory = ref<string>("");
const selectedCategoryParentId = ref<Category>();
const isListOpened = ref<Category[]>(openList(categoriesList.value));

// Toggle Open/Close a list having children
const toggleOpenList = (list: Category) => {
    const categoriesList = isListOpened.value.find((el) => el._id === list._id);
    if (categoriesList) {
        isListOpened.value = isListOpened.value.filter(
            (el) => el._id !== list._id
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
const updateCategoryOrders = async (categories: Category) => {
    let categoriesId: string[] = [];

    /*     if (categories.children && categories.children.length) {
        categoriesId = categories.children.map((cat) => cat._id);
    }

    const responseUpdateCategoryOrders = await Categories.updateCategoryOrders(
        selectedCategoryParentId.value?._id || "",
        categoriesId,
        siteId.value
    );
    if (responseUpdateCategoryOrders) {
        console.log("UPDATED");
    } */
};

const findParent = (categories: Category[]) => {
    categories.map((cat) => {
        if (cat.children && cat.children.length) {
            findParent(cat.children);
        }

        cat.children.forEach((child) => {
            if (child._id === selectedCategory.value) {
                selectedCategoryParentId.value = cat;
            }
        });
        console.log(
            "SELECTED CATEGORY",
            selectedCategory.value,
            "PARENT",
            selectedCategoryParentId.value
        );
    });
};

const sortCategoriesList = (event: any) => {
    console.log(event.to, categoriesList.value);

    selectedCategory.value = event.item._underlying_vm_._id;

    findParent(categoriesList.value);
    updateCategoryOrders(selectedCategoryParentId.value);
};

watch(categoriesList.value, (newValue) => {
    categoriesList.value = newValue;
    console.log("NEWLIST", categoriesList.value);
});
</script>

<style lang="scss" scoped>
.dragArea {
    min-height: 100px;
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
