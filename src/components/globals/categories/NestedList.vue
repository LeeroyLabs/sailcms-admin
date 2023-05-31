<template>
    <div id="nested-sort-wrap"></div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from "vue";
import { useI18n } from "vue-i18n";

import NestedSort from "nested-sort";
import type {
    Category,
    CategorySortItem,
} from "@/libs/graphql/types/categories";
import { Categories } from "@/libs/graphql";
import { SailCMS } from "@/libs/graphql";

type Props = {
    categories?: Category[];
};
interface List {
    id: string;
    text: string;
    parent: string;
    children: Category[];
}

const props = defineProps<Props>();
const i18n = useI18n();
const emitter: any = inject("emitter");
const siteId = ref(SailCMS.getSiteId());

const categoriesList = ref(props.categories);
const formattedCategories = ref<List[]>([]);
const selectedCategory = ref<Category[]>([]);

// Return the locale as a string
const getLocale = () => (i18n.locale.value === "en" ? "en" : "fr");

// Format the categories to display in the NestedSort component
const formattedCategoriesList = (categoriesList: Category[]) => {
    const formattedList = categoriesList.map((cat) => {
        if (cat.children && cat.children.length) {
            formattedCategoriesList(cat.children);
        }

        return {
            id: cat._id,
            text: cat.name[getLocale()],
            parent: cat.parent_id,
            children: cat.children,
        };
    });

    formattedCategories.value = [
        ...formattedCategories.value,
        ...formattedList,
    ];
};

formattedCategoriesList(categoriesList.value!);

// Update category orders & parent id
const updateCategoryOrders = async (sortedCategories: CategorySortItem[]) => {
    const responseUpdateCategoryOrders = await Categories.updateCategoryOrders(
        sortedCategories,
        siteId.value
    );
    if (responseUpdateCategoryOrders) {
        console.log("UPDATED");
    }
};

// Return the category corresponding to the id
const findCategory = (categories: Category[], id: string) => {
    const category = categories.filter((cat) => {
        if (cat.children && cat.children.length) findCategory(cat.children, id);
        if (cat._id === id) {
            return cat;
        }
    });
    selectedCategory.value = [...selectedCategory.value, ...category];
};

onMounted(() => {
    new NestedSort({
        data: formattedCategories.value,
        actions: {
            onDrop(data: Omit<CategorySortItem, "children">[]) {
                // Children key from type CategorySortItem is removed by the library
                updateCategoryOrders(data);
            },
        },
        el: "#nested-sort-wrap",
        listClassNames: ["nested-sort"],
        listItemClassNames: "list-group-item",
        renderListItem: (el: any, item: List) => {
            el.innerHTML = `
                <div class='list-group-item--content' :class='{}'>
                    <p>${el.innerText}</p>
                    <div class='action'>
                        <span class='action-edit'>U</span>
                        <span class='action-delete'>D</span>
                    </div>
                </div>
            `;
            item.children && item.children.length
                ? el.classList.add("open")
                : el.classList.remove("open");
            return el;
        },
    });

    // Actions
    const lists = document.querySelectorAll(".list-group-item");
    lists.forEach((list: any) => {
        const categoryId: string = list.dataset.id;
        const editIcon: Element = list.querySelector(".action-edit");
        const deleteIcon: Element = list.querySelector(".action-delete");

        // Edit
        editIcon.addEventListener("click", () => {
            findCategory(categoriesList.value!, categoryId);
            emitter.emit("edit-item", selectedCategory.value[0]);
        });

        // Delete
        deleteIcon.addEventListener("click", () => {
            findCategory(categoriesList.value!, categoryId);
            emitter.emit("delete-item", selectedCategory.value[0]);
        });
    });
});
</script>

<style lang="scss" scoped>
:deep(.nested-sort--enabled li) {
    @apply tw-relative tw-cursor-move;

    .list-group-item--content {
        @apply tw-relative;
    }

    .action {
        @apply tw-flex tw-items-center tw-gap-2;
        @apply tw-h-full tw-w-10;
        @apply tw-absolute tw-top-2/4 tw-right-0 tw--translate-y-2/4;

        &-edit,
        &-delete {
            @apply tw-cursor-pointer;
        }
    }
}

:deep(.nested-sort li) {
    @apply tw-list-none tw-p-3;
}

:deep(.nested-sort li ol) {
    @apply tw-p-0 tw-mt-2;
}

:deep(.nested-sort .ns-dragged) {
    @apply tw-border tw-border-solid tw-border-[#ddd];
}

:deep(.nested-sort .ns-targeted) {
    @apply tw-border tw-border-solid tw-border-[#000000];
}
</style>
