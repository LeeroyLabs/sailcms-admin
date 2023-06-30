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
                <div id="tablist" class="tw-flex tw-flex-row tw-gap-x-6 tw-flex-wrap tw-gap-y-16">
                    <template v-for="(element, index) in schema">
                        <Tab :tab="element" :data-id="'tab-' + index" :title="element.label" @change="handleChanges"/>
                    </template>
                </div>
<!--                <Sortable-->
<!--                    :list="schema"-->
<!--                    item-key="data-id"-->
<!--                    tag="div"-->
<!--                    :options="{handle: '.drag-handle', ghostClass: 'ghost', animation: 300, swapTreshold: 0.05, dragoverBubble: false}"-->
<!--                    class="tw-flex tw-flex-row tw-gap-x-6 tw-flex-wrap tw-gap-y-16"-->
<!--                    @end="handleTabChanges"-->
<!--                >-->
<!--                    -->
<!--                </Sortable>-->
            </div>
        </div>
    </template>
    <Loader v-else/>
</template>

<script setup>
import { hasPermission } from '@/libs/tools';
import Sortable from 'sortablejs';
import { v4 } from "uuid";
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import Loader from '@/components/globals/Loader.vue';
import Tab from '@/components/globals/layout/tab.vue';
import { pullAt } from 'lodash';

const isReady = ref(false);

let schemaStruct = [
    {
        label: 'Main',
        id: v4(),
        fields: [
            {
                "key": "fieldkey",
                "label": {"fr": "Mon Champ", "en": "My Field"},
                "placeholder": {"fr": "ecrire quelque chose", "en": "write something"},
                "explain": {"fr": "", "en": ""},
                "required": false,
                "repeater": true,
                "config": {
                    "min": 13,
                    "max": 255,
                    "validation": "url"
                }
            },
            {
                "key": "fieldkey2",
                "label": {"fr": "Mon Champ", "en": "My Field"},
                "placeholder": {"fr": "ecrire quelque chose", "en": "write something"},
                "explain": {"fr": "", "en": ""},
                "required": false,
                "repeater": true,
                "config": {
                    "min": 13,
                    "max": 255,
                    "validation": "url"
                }
            },
            {
                "key": "fieldkey3",
                "label": {"fr": "Mon Champ", "en": "My Field"},
                "placeholder": {"fr": "ecrire quelque chose", "en": "write something"},
                "explain": {"fr": "", "en": ""},
                "required": false,
                "repeater": true,
                "config": {
                    "min": 13,
                    "max": 255,
                    "validation": "url"
                }
            },
        ]
    },
    {
        label: 'Options',
        id: v4(),
        fields: []
    }
];

const schema = ref(schemaStruct);
const virtualSchema = schemaStruct;

onBeforeUnmount(() => window.removeEventListener('resize', () => resizeWorkspace()));

const resizeWorkspace = () =>
{
    let controlsSize = document.getElementById('controls').clientHeight;
    let headerSize = document.querySelector('header.v-toolbar').clientHeight;
    let pageControlSize = document.getElementById('pagecontrols').clientHeight;
    const offset = (controlsSize * 2) + headerSize + pageControlSize;
    document.getElementById('workspace').style.height = window.innerHeight - offset + 'px';
}

const handleChanges = (e) =>
{
    const tab = virtualSchema.find(t => t.id === e.tab);

    switch (e.event)
    {
        case 'add':
            let element = null;

            for (let i = 0; i < virtualSchema.length; i++) {
                for (let f of virtualSchema[i].fields) {
                    if (f.key === e.field) {
                        element = f;
                        break;
                    }
                }
            }

            if (element) {
               tab.fields.splice(e.index, 0, element);
            }
            break;

        case 'remove':
            tab.fields = tab.fields.filter(f => f.key !== e.field);
            break;

        case 'end':
            // Sort list only
            // if (e.oldIndex === e.index) return;
            //
            // let item = tab.fields.find(f => f.key === e.field);
            // let fields = pullAt(tab.fields, [e.oldIndex]);
            // fields = fields.splice(e.index, 0, item);
            //
            // console.log('<---', fields);
            //
            // tab.fields = fields;
            break;
    }

    console.log(virtualSchema);
}

const handleTabChanges = (e) =>
{

}

const opts = {
    handle: '.drag-handle',
    tag: 'div',
    direction: 'horizontal',
    ghostClass: 'ghost',
    animation: 300,
    swapTreshold: 0.05,
    dragoverBubble: false,
    onEnd: handleTabChanges
};

onMounted(() =>
{
    isReady.value = true;

    nextTick(() =>
    {
        window.addEventListener('resize', () => resizeWorkspace());
        resizeWorkspace();

        let el = document.querySelector('#tablist');
        new Sortable(el, opts);
    });
});

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
