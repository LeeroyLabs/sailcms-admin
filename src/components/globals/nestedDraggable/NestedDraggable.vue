<template>
    <div
        :id="isParent ? 'nested' : ''"
        class="nested-sortable tw-flex tw-flex-col tw-gap-4"
        @drop="drop"
        @dragover="dragOver"
    >
        <div
            v-for="item in items"
            :key="item"
            :id="item._id"
            class="tw-relative tw-px-4 tw-pt-4 tw-border tw-rounded-md tw-cursor-grab"
            :class="{
                'hover:tw-bg-gray-100': $vuetify.theme.name === 'light',
                'hover:tw-bg-zinc-800 tw-border-zinc-600':
                    $vuetify.theme.name === 'dark',
            }"
            @dragstart="dragStart"
            @dragover="dragOver"
            @dragenter="dragEnter"
            @dragleave="dragLeave"
            @dragend="dragEnd"
            @drop="drop"
        >
            <v-icon
                icon="mdi-drag-horizontal-variant"
                class="handle"
                @mousedown="mouseDown"
                @mouseup="mouseUp"
            />
            {{ displayedOption(item) }}
            <div class="action group-hover:tw-visible">
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
            />
        </div>
    </div>
</template>

<script setup>
import { inject, onMounted } from "vue";

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

let nestedList;

// Events
const mouseDown = (event) => {
    event.target.parentNode.setAttribute("draggable", "true");
};

const mouseUp = (event) => {
    event.target.parentNode.setAttribute("draggable", "false");
};

const dragStart = (event) => {
    event.dataTransfer.setData("text/plain", event.target.id);
    event.target.classList.add("dragging");
};

const dragEnter = (event) => {
    event.preventDefault();
    if (event.target.classList.contains("nested-sortable")) {
        event.target.classList.add("dragover");
    }
};

const dragLeave = (event) => {
    event.target.classList.remove("dragover");
};

const dragOver = (event) => {
    event.preventDefault();
    return false;
};

const dragEnd = (event) => {
    event.target.classList.remove("dragging");
};

const drop = (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("text/plain");
    if (event.target.classList.contains("nested-sortable")) {
        event.target.appendChild(document.getElementById(data));
        event.dataTransfer.dropEffect = "move";
        event.target.classList.remove("dragover");
        const structure = getNodesForParent(nestedList);
        emits("update-list", structure);
    }
};

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

onMounted(() => (nestedList = document.getElementById("nested")));
</script>

<style lang="scss" scoped>
.nested-sortable {
    @apply tw-py-2;
}

.dragover {
    @apply tw-border tw-border-dashed tw-border-[#666];
}

.dragging {
    @apply tw-opacity-50;
}

.action {
    @apply tw-absolute tw-top-6 tw--translate-y-2/4 tw-right-4;
}
</style>
