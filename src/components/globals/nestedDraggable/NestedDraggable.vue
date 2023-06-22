<template>
    <div v-if="items && items.length">
        <ul :id="uuidv4()" class="tw-p-4" @drop="drop" @dragover="allowDrop">
            <li
                v-for="(item, index) in itemsRef"
                :key="item"
                :id="uuidv4()"
                class="tw-px-4 tw-py-1 tw-mb-2 tw-border tw-rounded-md tw-mt-2 tw-cursor-grab"
                :class="{
                    'hover:tw-bg-gray-100': $vuetify.theme.name === 'light',
                    'hover:tw-bg-zinc-800 tw-border-zinc-600':
                        $vuetify.theme.name === 'dark',
                }"
                @dragstart="dragStart"
                @dragover="allowDrop"
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
                {{ item.label }}

                <NestedDraggable :items="item.children" />
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onUpdated } from "vue";
import { v4 as uuidv4 } from "uuid";

const props = defineProps({
    items: Array,
    required: true,
});
const emits = defineEmits(["update:items"]);

const itemsRef = ref(props.items);

const allowDrop = (event) => {
    event.preventDefault();
};

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
    event.target.classList.add("dragover");
};

const dragLeave = (event) => {
    event.target.classList.remove("dragover");
};

const dragEnd = (event) => {
    event.target.classList.remove("dragging");
};

const drop = (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("text/plain");
    event.target.appendChild(document.getElementById(data));
    event.dataTransfer.dropEffect = "move";
    event.target.classList.remove("dragover");
};

onUpdated(() => {
    console.log("UPDATED", props.items);
    emits("update:items", props.items);
});
</script>

<style lang="scss" scoped>
#draggable {
    text-align: center;
    background: white;
}

.dropzone {
    width: 200px;
    height: 20px;
    background: blueviolet;
    margin: 10px;
    padding: 10px;
}

.dragover {
    border: 2px dotted #666;
}

.dragging {
    opacity: 0.5;
}
</style>
