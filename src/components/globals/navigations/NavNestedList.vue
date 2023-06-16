<template>
    <div id="nested-sort-wrap"></div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, onUpdated } from "vue";
import {
    NavigationItem,
    SortedNavigationItem,
} from "@/libs/graphql/types/navigations";
import { useTheme } from "vuetify";
import NestedSort from "nested-sort";

interface Props {
    items: NavigationItem[];
}
interface List {
    id: string;
    text: string;
    parent: string;
}
const props = defineProps<Props>();
const emitter: any = inject("emitter");
const theme = useTheme();

const formattedItems = ref(
    props.items.map((item) => {
        return { ...item, text: item.label };
    })
);

// Check if a nav item has children
const hasChildren = (navItems: NavigationItem[]) => {
    const navItemsId = navItems.map((item) => {
        if (item.children && item.children.length) return item.id;
    });

    // Add class if element has children
    const lists = document.querySelectorAll(".list-group-item");
    lists.forEach((list: any) => {
        if (navItemsId.includes(list.dataset.id)) {
            list.classList.add("sublist");
        }
    });

    return navItemsId;
};

// Toggle open list
const toggleOpenList = () => {
    const openedLists = document.querySelectorAll(".list-group-item.sublist");
    openedLists.forEach((list: Element) => {
        const pTag = list.querySelector(".list-group-item--content p");
        if (pTag) {
            pTag.addEventListener("click", () => {
                list.classList.toggle("opened");
            });
        }
    });
};

onMounted(() => {
    console.log("ITEMS", props.items);

    new NestedSort({
        data: formattedItems.value,
        actions: {
            onDrop(data: SortedNavigationItem[]) {
                emitter.emit("update-list", data);
            },
        },
        propertyMap: {
            parent: "parent_id",
        },
        el: "#nested-sort-wrap",
        listClassNames: ["nested-sort"],
        listItemClassNames: "list-group-item",
        renderListItem: (el: HTMLElement, item: List) => {
            el.innerHTML = `
            <div class='list-group-item--content'>
                <p>${el.innerText}</p>
                <div class='action'>
                    <span class='action-edit mdi mdi-square-edit-outline' data-id='${item.id}'></span>
                    <span class='action-delete mdi mdi-trash-can-outline tw-text-red-600' data-id='${item.id}'></span>
                </div>
            </div>
        `;

            return el;
        },
    });

    hasChildren(formattedItems.value);
    toggleOpenList();

    // Actions
    const lists = document.querySelectorAll(".list-group-item");
    lists.forEach((list: any) => {
        const editIcon: Element = list.querySelector(".action-edit");
        const deleteIcon: Element = list.querySelector(".action-delete");

        // Edit
        editIcon.addEventListener("click", (event: any) => {
            const navItemId: string = event.target.dataset.id;
            const selectedNavItem = props.items.find(
                (item) => item.id === navItemId
            );
            console.log("ITEM", navItemId, props.items, selectedNavItem);
            emitter.emit("edit-item", selectedNavItem);
        });

        // Delete
        deleteIcon.addEventListener("click", (event: any) => {
            const navItemId: string = event.target.dataset.id;
            const selectedNavItem = props.items.find(
                (item) => item.id === navItemId
            );
            emitter.emit("delete-item", selectedNavItem);
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
    hasChildren(formattedItems.value);
});
</script>

<style lang="scss" scoped>
:deep(.nested-sort--enabled li) {
    @apply tw-relative tw-cursor-grab;

    .list-group-item--content {
        @apply tw-relative tw-rounded tw-p-2;

        &:hover {
            .action-edit,
            .action-delete {
                @apply tw-block;
            }
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
    @apply tw-list-none tw-p-3;
}

:deep(.nested-sort li ol) {
    @apply tw-p-0 tw-px-2 tw-mt-3 tw--mb-1;
    @apply tw-border tw-border-dashed tw-border-[#ddd]/75;
}

:deep(.nested-sort .ns-dragged) {
    @apply tw-border tw-border-solid tw-border-[#ddd];
}

:deep(.nested-sort .ns-targeted) {
    @apply tw-border tw-border-solid tw-border-[#000000];
}
</style>
