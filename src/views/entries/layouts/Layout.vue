<template>
    <template v-if="isReady">
        <Teleport to="#actions">
            <v-btn @click.prevent="$router.push({name: 'SingleLayout', params: {id: 'add'}})" color="primary" v-if="hasPermission('readwrite_entry_layout')">
                {{ $t('system.save') }}
            </v-btn>
        </Teleport>
        <div id="controls" class="tw-w-full tw-border tw-p-8 tw-mb-4">

        </div>
        <div id="workspace" class="tw-w-full tw-overflow-y-auto tw-border tw-rounded-md" :class="{'dark': $vuetify.theme.name === 'dark', 'light tw-border-zinc-400': $vuetify.theme.name === 'light'}">
            <div id="workspace-ui" class="tw-w-full bg-grid tw-py-20 tw-px-6">
                <Sortable
                    :list="[1, 2, 3]"
                    item-key="id"
                    tag="div"
                    :options="{handle: '.drag-handle', ghostClass: 'ghost', animation: 300, swapTreshold: 0.05, dragoverBubble: false}"
                    class="tw-flex tw-flex-row tw-gap-x-6 tw-flex-wrap tw-gap-y-16"
                >
                    <template #item="{element, index}">
                        <Tab data-id="tt" :title="'Tab Name ' + index"/>
                    </template>
                </Sortable>
            </div>
        </div>
    </template>
    <Loader v-else/>
</template>

<script setup>
import { hasPermission } from '@/libs/tools';
import { Sortable } from "sortablejs-vue3";

const isReady = ref(false);

import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import Loader from '@/components/globals/Loader.vue';
import Tab from '@/components/globals/layout/tab.vue';

onMounted(() =>
{
    isReady.value = true;

    nextTick(() =>
    {
        window.addEventListener('resize', () => resizeWorkspace());
        resizeWorkspace();
    });
});

onBeforeUnmount(() => window.removeEventListener('resize', () => resizeWorkspace()));

const resizeWorkspace = () =>
{
    let controlsSize = document.getElementById('controls').clientHeight;
    let headerSize = document.querySelector('header.v-toolbar').clientHeight;
    let pageControlSize = document.getElementById('pagecontrols').clientHeight;
    const offset = (controlsSize * 2) + headerSize + pageControlSize;
    document.getElementById('workspace').style.height = window.innerHeight - offset + 'px';
}
</script>

<style>
div.light {
    background-size: 20px 20px;
    background-repeat: repeat;
    background-image:
        linear-gradient(to right, rgba(0, 0, 0, 0.15) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0, 0, 0, 0.15) 1px, transparent 1px);
}

div.dark {
    background-size: 20px 20px;
    background-repeat: repeat;
    background-image:
        linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px);
}

.ghost {
    opacity: 0.65;
}
</style>
