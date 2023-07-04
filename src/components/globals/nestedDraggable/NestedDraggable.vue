<template>
    <div
        :id="isParent ? 'nested' : ''"
        class="nested-sortable tw-flex tw-flex-col tw-gap-4"
        :class="{ open: isOpened }"
        @end="handleSorting"
    >
        <div
            v-for="item in items"
            :key="item"
            :id="item._id"
            class="item tw-relative tw-px-4 tw-pt-4 tw-border tw-rounded-md"
            :class="{
                'hover:tw-bg-gray-100': $vuetify.theme.name === 'light',
                'hover:tw-bg-zinc-800 tw-border-zinc-600':
                    $vuetify.theme.name === 'dark',
                'tw-pb-4': !isListOpened.includes(item),
            }"
        >
            <v-icon
                icon="mdi-drag-horizontal-variant"
                class="handle tw-cursor-grab"
            />

            {{ displayedOption(item) }}
            <v-icon
                v-if="item.children.length"
                :icon="
                    isListOpened.includes(item)
                        ? 'mdi-chevron-down'
                        : 'mdi-chevron-up'
                "
                class="tw-cursor-pointer"
                @click="toggleOpenList(item)"
            />

            <div class="action">
                <v-btn
                    @click.prevent="updateItem(item)"
                    density="comfortable"
                    icon="mdi-pencil"
                    height="40"
                    width="40"
                    variant="flat"
                    rounded
                />
                <span class="tw-text-red-600">
                    <v-btn
                        @click.prevent="deleteItem(item)"
                        density="comfortable"
                        color="red"
                        variant="tonal"
                        rounded
                        icon="mdi-trash-can-outline"
                    />
                </span>
            </div>

            <NestedDraggable
                :items="item.children"
                :displayedOption="displayedOption"
                :class="isListOpened.includes(item) ? 'tw-block' : 'tw-hidden'"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import Sortable from "sortablejs";

const props = defineProps({
    items: { type: Array, required: true },
    displayedOption: {
        type: Function,
        default: (item) => item,
        required: true,
    },
    isParent: {
        type: Boolean,
        default: false,
        required: false,
    },
});

const emits = defineEmits(["update-list"]);
const emitter = inject("emitter");
const isOpened = ref(true);
let nestedList;

// Open lists having children by default
const openList = (array) => {
    const list = array.filter((el) => {
        if (el.children && el.children.length) {
            openList(el.children);
        }
        return el;
    });
    return list;
};

const isListOpened = ref(openList(props.items));

// Toggle Open/Close a list having children
const toggleOpenList = (item) => {
    const itemsList = isListOpened.value.find((el) => el._id === item._id);
    if (itemsList) {
        isListOpened.value = isListOpened.value.filter(
            (el) => el._id !== item._id
        );
    } else {
        isListOpened.value.push(item);
    }
};

// Build structure. Returns an array of items with their children
const getNodesForParent = (parent) => {
    let elements = parent.childNodes;
    let tree = [];
    let order = 0;

    for (let el of elements) {
        if (el.id !== undefined && el.id !== "" && el instanceof HTMLElement) {
            order++;

            let obj = {
                order: order,
                _id: el.id,
                children: [],
            };

            for (let subel of el.childNodes) {
                if (
                    subel.classList &&
                    subel.classList.contains("nested-sortable")
                ) {
                    obj.children = getNodesForParent(subel);
                }
            }

            tree.push(obj);
        }
    }
    return tree;
};

// Events
const handleSorting = () => {
    const structure = getNodesForParent(nestedList);
    emits("update-list", structure);
};

// Actions
const updateItem = (item) => {
    emitter.emit("update-item", item);
};

const deleteItem = (item) => {
    const element = document.getElementById(`${item._id}`);
    element.remove();
    const structure = getNodesForParent(nestedList);
    emitter.emit("delete-item", { structure, item });
};

// Lifecycle hooks
onMounted(() => {
    nestedList = document.getElementById("nested");
    const elements = document.getElementsByClassName("nested-sortable");

    for (let i = 0; i < elements.length; i++) {
        new Sortable(elements[i], {
            group: "shared",
            invertSwap: true,
            handle: ".handle",
            animation: 150,
        });
    }
});
</script>

<style lang="scss" scoped>
.nested-sortable {
    @apply tw-py-2;
}

.dragover {
    @apply tw-border tw-border-dashed tw-border-[#666] tw-pt-6;
}

.dragging {
    @apply tw-opacity-50;
}

.action {
    @apply tw-absolute tw-top-6 tw--translate-y-2/4 tw-right-4;
}
</style>
