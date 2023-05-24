<template>
    <draggable
        class="dragArea"
        tag="ul"
        :list="items"
        :group="{ name: 'categories' }"
        item-key="name"
    >
        <template #item="{ element }">
            <li v-if="element.items.length">
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
                        {{ element.name }}
                        <v-icon
                            :icon="
                                isListOpened.includes(element)
                                    ? 'mdi-chevron-down'
                                    : 'mdi-chevron-up'
                            "
                        />
                    </p>
                    <v-icon
                        icon="mdi-delete"
                        class="tw-hidden"
                        @click="handleDeleteItem(element)"
                    />
                </div>
                <NestedList
                    v-if="element.items.length"
                    :items="element.items"
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
                        {{ element.name }}
                    </p>
                    <v-icon
                        icon="mdi-delete"
                        class="tw-hidden"
                        @click="handleDeleteItem(element)"
                    />
                </div>
                <NestedList
                    v-if="element.items.length"
                    v-model:items="element.items"
                />
            </li>
        </template>
    </draggable>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import draggable from "vuedraggable";

interface Item {
    name: string;
    items: Item[] | [];
}

type Props = {
    items: Item[];
};
const props = defineProps<Props>();
const emitter = inject("emitter");

const isListOpened = ref<Item[]>(props.items.filter((el) => el));

// Open/Close a list with sub categories
const toggleOpenList = (list: Item) => {
    const categoriesList = isListOpened.value.find(
        (el) => el.name === list.name
    );
    if (categoriesList) {
        isListOpened.value = isListOpened.value.filter(
            (el) => el.name !== list.name
        );
    } else {
        isListOpened.value.push(list);
    }
};

// Delete a category
const handleDeleteItem = (item: Item) => emitter.emit("delete-item", item);
</script>

<style lang="scss" scoped>
ul {
    li {
        @apply tw-cursor-pointer;
        @apply tw-pl-10 tw-py-2;

        div:hover {
            .mdi-delete {
                @apply tw-block;
            }
        }
    }
}
</style>
