<template>
    <draggable :list="categories" tag="transition-group"
        @start="drag = true"
        @end="drag = false"
        handle=".handle"
        v-bind="dragOptions"
        :component-data="{
          tag: 'ul',
          type: 'transition-group',
          name: !drag ? 'flip-list' : null
        }">
        <template #item="{element}">
            <div class="!tw-px-4 !tw-py-1 tw-mb-2 tw-border !tw-rounded-md tw-mt-2" :class="{'hover:!tw-bg-gray-100': $vuetify.theme.name === 'light', 'hover:!tw-bg-zinc-800 tw-border-zinc-600': $vuetify.theme.name === 'dark'}">
                <div class="tw-flex tw-flex-row tw-items-center tw-group">
                    <div class="handle tw-cursor-grab tw-mr-4"><v-icon icon="mdi-menu" size="large"/></div>
                    <div class="tw-flex-grow">{{element.name[$i18n.locale]}}</div>
                    <div class="action tw-invisible group-hover:tw-visible">
                        <v-btn @click.prevent="editCategory(element)" density="comfortable" icon="mdi-pencil" height="40" width="40" variant="flat" rounded data-id="${item.id}"></v-btn>
                        <span class="tw-text-red-600">
                            <v-btn @click.prevent="removeCategoryFromList(element)" density="comfortable" color="red" variant="tonal" rounded icon="mdi-trash-can-outline" data-id="${item.id}"></v-btn>
                        </span>
                    </div>
                </div>

                <Nested :categories="element.children"/>
            </div>
        </template>
    </draggable>
</template>
<script setup>
import { ref, watch } from 'vue';
import { useTheme } from 'vuetify';

const props = defineProps({
    categories: {
        required: true,
        type: Array
    }
});

const theme = useTheme();
const drag = ref(false);
const dragOptions = {
    animation: 200,
    group: "description",
    disabled: false,
    ghostClass: theme.name.value === 'dark' ? 'ghost-dark' : 'ghost'
};

watch(props.categories, (list) =>
{
    // TODO: EMIT CHANGE (define emitter)
});

const editCategory = (el) =>
{
    // TODO: EMIT EDIT
}

const removeCategoryFromList = (el) =>
{
    // TODO: EMIT REMOVE
}

</script>

<style scoped>
.dragArea {
    min-height: 50px;
    outline: 1px dashed;
}

.flip-list-move {
    transition: transform 0.5s;
}

.no-move {
    transition: transform 0s;
}

.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}

.ghost-dark {
    opacity: 0.75;
    background: #111111;
}
</style>
