<template>
    <template v-if="isReady">
        <BackButton :url="{name: 'EntryLayouts'}"/>
        <Teleport to="#actions">
            <v-btn @click="() => saveLayout(true)" :loading="isSaving" color="secondary" class="tw-mr-2" v-if="hasPermission('readwrite_entry_layout')">
                {{ $t('system.save_exit') }}
            </v-btn>
            <v-btn @click="() => saveLayout(false)" :loading="isSaving" color="primary" v-if="hasPermission('readwrite_entry_layout')">
                {{ $t('system.save') }}
            </v-btn>
        </Teleport>

        <div class="tw-flex tw-flex-col md:tw-flex-row tw-justify-start tw-gap-y-6 md:tw-gap-y-0">
            <div id="workspace" class="tw-w-full tw-overflow-y-auto tw-border tw-rounded-md" :class="{'dark': $vuetify.theme.name === 'dark', 'light tw-border-zinc-400': $vuetify.theme.name === 'light'}">
                <div class="tw-mb-8 tw-p-5">
                    <v-form autocomplete="off">
                        <v-text-field
                            variant="outlined"
                            color="primary"
                            :hide-details="true"
                            v-model="layoutName"
                            :rules="[rules.required]"
                            density="comfortable"
                            :label="$t('layout.layout_name')"
                            class="tw-mb-2"
                            :class="{'tw-bg-white': $vuetify.theme.name === 'light', 'tw-bg-darkbg': $vuetify.theme.name === 'dark'}"
                        />
                    </v-form>
                </div>
                <div id="workspace-ui" class="tw-w-full bg-grid tw-px-6">
                    <div id="tablist" class="tw-flex tw-flex-row tw-gap-x-6 tw-flex-wrap tw-gap-y-16">
                        <template v-if="forced" v-for="(element, index) in schema" :key="element.key">
                            <Tab
                                :fields="fields"
                                :tab="element"
                                :id="element.id"
                                :data-id="'tab-' + index"
                                :title="element.label"
                                @change="handleChanges"
                                @added="handleAddition"
                                @removed="handleRemoved"
                                @tab-deleted="handleTabDelete"
                                @tab-name-change="handleTabNameChange"
                            />
                        </template>
                    </div>
                </div>
                <div class="tw-p-4 tw-px-6 tw-mt-2 tw-z-0">
                    <v-btn @click.prevent="showAddTabDialog=true" color="primary" prepend-icon="mdi-plus">{{ $t('layout.add_tab') }}</v-btn>
                </div>
            </div>
        </div>
        <Transition>
            <AddTab
                v-if="showAddTabDialog"
                :show="showAddTabDialog"
                :loading="false"
                :overall="true"
                :title="$t('layout.select_tabname')"
                @cancel="showAddTabDialog=false"
                @assign="addTab"
            />
        </Transition>
    </template>
    <Loader v-else/>
</template>

<script setup>
import { hasPermission } from '@/libs/tools';
import Sortable from 'sortablejs';
import { v4 } from "uuid";
import { getCurrentInstance, nextTick, onBeforeUnmount, ref } from 'vue';
import Loader from '@/components/globals/Loader.vue';
import Tab from '@/components/entries/layout/Tab.vue';
import { Entries } from '@/libs/graphql/lib/entries';
import { SailCMS } from '@/libs/graphql';
import BackButton from '@/components/globals/BackButton.vue';
import { useRoute, useRouter } from 'vue-router';
import AddTab from '@/components/entries/layout/AddTab.vue';
import { useI18n } from 'vue-i18n';
import { deburr, kebabCase } from 'lodash';
import { useAppStore } from '@/store/app';

const isReady = ref(false);
const fields = ref([]);
const route = useRoute();
const router = useRouter();
const i18n = useI18n();
const store = useAppStore();

const rules = {
    required: value => !!value || i18n.t('user.errors.required'),
};

let schemaStruct = [
    {
        label: 'Main',
        id: v4(),
        key: v4(),
        fields: []
    }
];

const schema = ref(schemaStruct);
let virtualSchema = schemaStruct;
const showAddTabDialog = ref(false);
const layoutName = ref('');
const isSaving = ref(false);

const forced = ref(true);

let sortableObj;

onBeforeUnmount(() => window.removeEventListener('resize', () => resizeWorkspace()));

const resizeWorkspace = () =>
{
    let headerSize = document.querySelector('header.v-toolbar').clientHeight;
    let pageControlSize = document.getElementById('pagecontrols').clientHeight;
    const offset = headerSize + pageControlSize + 50;
    document.getElementById('workspace').style.height = window.innerHeight - offset + 'px';
}

const addTab = (name) =>
{
    let tabid = v4();
    schema.value.push({label: name, id: tabid, fields: []});
    showAddTabDialog.value = false;

    nextTick(() =>
    {
        sortableObj.destroy();
        sortableObj = new Sortable(document.querySelector('#tablist'), opts);
    });
}

const handleChanges = (e) =>
{
    const tab = virtualSchema.find(t => t.id === e.tab);
    tab.fields = e.used;
}

const handleAddition = (e) =>
{
    const tab = virtualSchema.find(t => t.id === e.tab);

    for (let key of e.used) {
        let field = fields.value.find(f => f.key === key);
        field.used = true;
    }

    tab.fields = e.used;
}

const handleRemoved = (e) =>
{
    const tab = virtualSchema.find(t => t.id === e.tab);
    const field = fields.value.find(f => f.key === e.key);

    if (field) field.used = false;
    tab.fields = e.used;
    tab.key = v4();
    tab.id = v4();

    schema.value = virtualSchema;

    // This is f***ing terrible, but Vue is being a really a**hole right now.
    forced.value = false;
    nextTick(() => forced.value = true);
}

const handleTabChanges = (e) =>
{
    const children = Array.from(document.getElementById('tablist').children).map(c => c.id);
    let reformatted = [];

    for (let child of children) {
        for (let tab of schemaStruct) {
            if (tab.id === child) {
                reformatted.push(tab);
            }
        }
    }
}

const handleTabNameChange = (e) =>
{
    let tab = virtualSchema.find(t => t.id === e.tab.id);
    tab.label = e.label;

    tab = schema.value.find(t => t.id === e.tab.id);
    tab.label = e.label;

    // Force rerender
    tab.key = v4();

    schema.value = virtualSchema;
}

const handleTabDelete = (e) =>
{
    const clearList = [];

    for (let field of e.fields) {
        clearList.push(field);
    }

    virtualSchema = virtualSchema.filter(t => t.id !== e.id);
    schema.value = schema.value.filter(t => t.id !== e.id);

    for (let key of clearList) {
        let field = fields.value.find(f => f.key === key);
        field.used = false;
    }
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

const loadFields = async () =>
{
    fields.value = await Entries.fields(SailCMS.getLocales());

    fields.value = fields.value.map(f => {
        return {
            ...f,
            used: false
        }
    });

    if (route.params.id !== 'add') {
        const layout = await Entries.entryLayout(route.params.id);
        layoutName.value = layout.title;
        schemaStruct = [];

        for (let tab of layout.schema) {
            let _fields = [];

            for (let _field of tab.fields) {
                _fields.push(_field.key);

                let field = fields.value.find(f => f.key === _field.key);
                if (field) field.used = true;
            }

            schemaStruct.push({
                label: tab.label,
                id: v4(),
                key: v4(),
                fields: _fields
            });
        }

        schema.value = schemaStruct;
        virtualSchema = schemaStruct;
    }

    isReady.value = true;

    nextTick(() =>
    {
        window.addEventListener('resize', () => resizeWorkspace());
        resizeWorkspace();

        sortableObj = new Sortable(document.querySelector('#tablist'), opts);
    });
}

const saveLayout = async (exit = false) =>
{
    if (layoutName.value.trim() === '') return;
    if (isSaving.value) return;

    let saveStruct = [];

    for (let tab of schema.value) {
        let _fields = [];

        for (let field of tab.fields) {
            let _field = fields.value.find(f => f.key === field);

            if (_field !== undefined) {
                _fields.push(_field._id);
            }
        }

        saveStruct.push({
            label: tab.label,
            fields: _fields
        });
    }

    isSaving.value = true;
    let result;

    if (route.params.id === 'add') {
        result = await Entries.createEntryLayout(layoutName.value, saveStruct, kebabCase(deburr(layoutName.value)));
    } else {
        result = await Entries.updateEntryLayout(route.params.id, layoutName.value, saveStruct, kebabCase(deburr(layoutName.value)));
    }

    isSaving.value = false;

    if (result) {
        store.displayToast('success', i18n.t('layout.save_success'));

        if (exit) await router.push({name: 'EntryLayouts'});
    } else {
        store.displayToast('error', i18n.t('layout.save_error'));
    }
}

loadFields();
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
