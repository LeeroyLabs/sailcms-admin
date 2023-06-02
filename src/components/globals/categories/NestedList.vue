<template>
    <div id="nested-sort-wrap"></div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, onUpdated } from "vue";
import { useI18n } from "vue-i18n";
import { useTheme } from "vuetify";

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
}

const props = defineProps<Props>();
const i18n = useI18n();
const emitter: any = inject("emitter");
const siteId = ref<string>(SailCMS.getSiteId());
const theme = useTheme();

const categoriesList = ref<Category[]>(props.categories!);
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
        emitter.emit("update-list");
    }
};

// Check if a category has children
const hasChildren = (categories: Category[]) => {
    const categoriesId = categories
        .map((cat) => {
            if (cat.children && cat.children.length) {
                hasChildren(cat.children);
                return cat._id;
            }
        })
        .filter((el) => el);

    // Add class if element has children
    const lists = document.querySelectorAll(".list-group-item");
    lists.forEach((list: any) => {
        if (categoriesId.includes(list.dataset.id)) {
            list.classList.add("sublist");
        }
    });

    return categoriesId;
};

// Return the category corresponding to the id
const findCategory = (categories: Category[], id: string) => {
    const category = categories.filter((cat) => {
        if (cat.children && cat.children.length) findCategory(cat.children, id);
        return cat._id === id;
    });
    selectedCategory.value = [...selectedCategory.value, ...category];
};

// Toggle open list
const toggleOpenList = () => {
    const openedLists = document.querySelectorAll(".list-group-item.sublist");
    openedLists.forEach((cat: Element) => {
        const pTag = cat.querySelector(".list-group-item--content p");
        if (pTag) {
            pTag.addEventListener("click", () => {
                cat.classList.toggle("opened");
            });
        }
    });
};

// Lifecycle functions
onMounted(() => {
    new NestedSort({
        data: formattedCategories.value,
        actions: {
            onDrop(data: CategorySortItem[]) {
                updateCategoryOrders(data);
            },
        },
        el: "#nested-sort-wrap",
        listClassNames: ["nested-sort"],
        listItemClassNames: "list-group-item",
        renderListItem: (el: HTMLElement, item: List) => {
            el.innerHTML = `
            <div class='list-group-item--content'>
                <p><span class='mdi mdi-drag'></span>${el.innerText}</p>
                <div class='action'>
                    <span class='action-edit mdi mdi-square-edit-outline'></span>
                    <span class='action-delete mdi mdi-trash-can-outline'></span>
                </div>
            </div>
        `;

            return el;
        },
    });

    hasChildren(categoriesList.value!);
    toggleOpenList();

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

    // Class
    const listContent = document.querySelectorAll(".list-group-item--content");
    listContent.forEach((li: Element) => {
        theme.name.value === "light"
            ? li.classList.toggle("hover:tw-bg-[#E5E7EB]/20")
            : li.classList.toggle("hover:tw-bg-white/20");
    });
});

onUpdated(() => {
    hasChildren(categoriesList.value!);
});
</script>

<style lang="scss" scoped>
:deep(.nested-sort--enabled li) {
    @apply tw-relative tw-cursor-move;

    .list-group-item--content {
        @apply tw-relative tw-rounded tw-p-2;

        p {
            @apply tw-flex tw-items-center tw-gap-2;

            span {
                font: normal normal normal 24px/1 "Material Design Icons";
            }
        }

        &:hover {
            .action-edit,
            .action-delete {
                @apply tw-block;
            }
        }
    }

    .action {
        @apply tw-flex tw-items-center tw-gap-2;
        @apply tw-absolute tw-top-2/4 tw-right-4 tw--translate-y-2/4;

        &-edit {
            @apply tw-cursor-pointer tw-hidden;
            font: normal normal normal 24px/1 "Material Design Icons";
        }

        &-delete {
            @apply tw-cursor-pointer tw-hidden;
            font: normal normal normal 24px/1 "Material Design Icons";
        }
    }

    &.sublist {
        > .list-group-item--content > p {
            @apply tw-w-max tw-relative;

            &:before {
                @apply tw-content-['\F0140'] tw-absolute tw--right-8 tw-cursor-pointer;
                font: normal normal normal 24px/1 "Material Design Icons";
            }
        }

        &.opened {
            > ol {
                @apply tw-hidden;
            }

            > .list-group-item--content > p {
                @apply tw-w-max tw-relative;

                &:before {
                    @apply tw-rotate-180;
                }
            }
        }
    }
}

:deep(.nested-sort li) {
    @apply tw-list-none tw-p-3 tw-mb-1;
}

:deep(.nested-sort li ol) {
    @apply tw-p-0 tw-px-2 tw-mt-3 tw--mb-5;
}

:deep(.nested-sort .ns-dragged) {
    @apply tw-border tw-border-solid tw-border-[#ddd];
}

:deep(.nested-sort .ns-targeted) {
    @apply tw-border tw-border-solid tw-border-[#000000];
}
</style>
