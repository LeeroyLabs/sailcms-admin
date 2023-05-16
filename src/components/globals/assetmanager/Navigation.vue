<template>
    <div :class="{'tw-w-[290px] lg:tw-w-[250px]': show, 'tw-w-[0px]': !show, 'tw-bg-slate-600': $vuetify.theme.name !== 'light', 'tw-bg-gray-200': $vuetify.theme.name === 'light'}" class="tw-transition-all tw-duration-300 tw-flex tw-flex-shrink-0 tw-flex-col tw-h-full tw-max-h-full">
        <Transition>
            <div
                v-if="showContent"
                class="tw-flex-grow tw-max-h-full tw-w-full tw-flex tw-flex-col tw-justify-between tw-border-r"
                :class="{'tw-bg-slate-600 tw-border-slate-700': $vuetify.theme.name !== 'light', 'tw-bg-gray-200 tw-border-gray-300': $vuetify.theme.name === 'light'}"
            >
                <div v-if="folders?.length > 0" class="tw-overflow-y-auto tw-flex tw-flex-col tw-p-4 tw-gap-y-1">
                    <template v-for="folder in folders">
                        <Folder
                            :name="folder.name"
                            :slug="folder.slug"
                            :active="active === folder.slug"
                            @click="$emit('change', folder.slug)"
                        />
                    </template>
                </div>
                <div v-if="folders?.length === 0" class="tw-flex tw-flex-row tw-items-center tw-w-full tw-h-full">
                    <div class="tw-flex tw-flex-col tw-items-center tw-w-full">
                        <v-progress-circular size="large" indeterminate/>
                    </div>
                </div>
                <div>
                    <div
                        class="tw-border-t tw-flex tw-flex-row"
                        :class="{'tw-bg-slate-600 tw-border-slate-700': $vuetify.theme.name !== 'light', 'tw-bg-gray-200 tw-border-gray-300': $vuetify.theme.name === 'light'}"
                    >
                        <div
                            @click.prevent="showAddFolder=true"
                            class="tw-py-2 tw-px-2 tw-cursor-pointer tw-text-center hover:tw-bg-primary tw-border-r"
                            :class="{'tw-bg-slate-600 tw-border-slate-700': $vuetify.theme.name !== 'light', 'tw-bg-gray-200 tw-border-gray-300': $vuetify.theme.name === 'light'}"
                        >
                            <v-icon icon="mdi-plus"/>
                        </div>

                        <div
                            @click.prevent="showDeleteConfirmationView"
                            class="tw-py-2 tw-px-2 tw-cursor-pointer tw-text-center hover:tw-bg-primary tw-border-r"
                            :class="{'tw-bg-slate-600 tw-border-slate-700': $vuetify.theme.name !== 'light', 'tw-bg-gray-200 tw-border-gray-300': $vuetify.theme.name === 'light'}"
                        >
                            <v-icon icon="mdi-minus"/>
                        </div>
                    </div>
                </div>

            </div>
        </Transition>
    </div>

    <!-- Add Folder -->
    <Transition>
        <div v-if="showAddFolder" class="tw-absolute tw-bg-black/40 tw-inset-0 tw-flex tw-flex-row tw-items-center tw-justify-center tw-z-[999]">
            <v-card rounded class="tw-p-6">
                <v-card-title>{{ $t('assets.add_folder') }}</v-card-title>
                <v-card-text class="tw-min-w-[300px] lg:tw-min-w-[450px] tw-mt-4">
                    <v-form @keydown.enter="addFolder" ref="form" lazy-validation>
                        <v-text-field
                            type="text"
                            color="primary"
                            variant="outlined"
                            density="comfortable"
                            validate-on="blur"
                            class="tw-w-full"
                            :placeholder="$t('assets.folder_name')"
                            v-model="newFolderName"
                            :rules="[rules.required]"
                        ></v-text-field>
                    </v-form>
                </v-card-text>

                <v-card-actions class="tw-flex tw-flex-row tw-justify-end">
                    <v-btn :disabled="isLoading" @click.prevent="cancelAddFolder" flat>{{ $t('assets.cancel') }}</v-btn>
                    <v-btn type="primary" color="primary" variant="flat" @click.prevent="addFolder" :loading="isLoading">{{ $t('assets.add') }}</v-btn>
                </v-card-actions>
            </v-card>
        </div>
    </Transition>

    <!-- Remove Folder -->
    <Transition>
        <div v-if="showDeleteConfirmation" class="tw-absolute tw-bg-black/40 tw-inset-0 tw-flex tw-flex-row tw-items-center tw-justify-center tw-z-[999]">
            <v-card rounded class="tw-p-6">
                <v-card-title>{{ $t('assets.remove_folder') }} "{{ active }}"</v-card-title>
                <v-card-text class="tw-min-w-[300px] lg:tw-min-w-[450px] tw-mt-4">
                    <label class="tw-text-sm tw-mb-2 tw-block">Choose a folder where to move files before deleting</label>
                    <v-select
                        v-model="selectedFolderTransfer"
                        color="primary"
                        :items="availableFoldersForTransfer"
                        variant="outlined"
                        density="comfortable"
                        single-line
                        class="tw-w-full"
                    />
                </v-card-text>

                <v-card-actions class="tw-flex tw-flex-row tw-justify-end">
                    <v-btn :disabled="isLoading" @click.prevent="cancelRemoveFolder" flat>{{ $t('assets.cancel') }}</v-btn>
                    <v-btn color="red" variant="flat" @click.prevent="removeFolder" :loading="isLoading">{{ $t('assets.remove') }}</v-btn>
                </v-card-actions>
            </v-card>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Folder from "@/components/globals/assetmanager/Folder.vue";
import { useDisplay } from "vuetify";
import { useAppStore } from "@/store/app";
import { useI18n } from "vue-i18n";
import { Assets } from "@/libs/graphql";

const display = useDisplay();
const store = useAppStore();
const i18n = useI18n();

const showContent = ref(!display.mobile.value);
const emitter = defineEmits(['close', 'change', 'folder-added', 'folder-removed']);
const form = ref(null);
const isLoading = ref(false);

const newFolderName = ref('');
const selectedMobileFolder = ref('root');
const showAddFolder = ref(false);
const showDeleteConfirmation = ref(false);
const selectedFolderTransfer = ref('root');

const props = defineProps({
    show: {
        type: Boolean,
        default: true
    },
    folders: {
        type: Array,
        default: []
    },
    active: {
        type: String,
        default: 'root'
    }
});

const rules = {
    required: value => !!value || i18n.t('login.errors.required'),
};

const cancelSelection = () => emitter('close');

// Toggle state of navigation
const toggleState = () =>
{
    showContent.value = !showContent.value;

    let value = 'show';
    if (!props.show) value = 'hide';
    localStorage.setItem('sam_nav', value);
}

// Show available folders
const availableFolders = computed(() =>
{
    let out = [];

    for (const folder of props.folders) {
        out.push({value: folder.slug, title: folder.name});
    }

    return out;
});

const availableFoldersForTransfer = computed(() =>
{
    return availableFolders.value.filter(f => f.value !== props.active);
});

// Add Folder on server
const addFolder = async () =>
{
    if (isLoading.value) return;

    isLoading.value = true;
    const status = await form.value.validate();

    if (status) {
        let response = await Assets.addFolder(newFolderName.value);

        if (response === 1) {
            emitter('folder-added', true);

            isLoading.value     = false;
            showAddFolder.value = false;
            newFolderName.value = '';
            return;
        }

        isLoading.value = false;

        if (response === 2) {
            store.displayToast('error', i18n.t('assets.errors.permissions'));
            return;
        }

        if (response === 3) {
            store.displayToast('error', i18n.t('assets.errors.exists'));
            return;
        }
    }
}

// Cancel Add Folder
const cancelAddFolder = () =>
{
    showAddFolder.value = false;
    newFolderName.value = '';
}

// Cancel folder delete
const cancelRemoveFolder = () =>
{
    selectedFolderTransfer.value = 'root';
    showDeleteConfirmation.value = false;
}

// Show delete overlay
const showDeleteConfirmationView = () =>
{
    if (props.active === 'root') return;
    showDeleteConfirmation.value = true;
}

const removeFolder = async () =>
{
    if (isLoading.value) return;

    isLoading.value = true;

    // @ts-ignore
    await Assets.removeFolder(props.active, selectedFolderTransfer.value);
    emitter('folder-removed', true);

    isLoading.value = false;
    showDeleteConfirmation.value = false;
    selectedFolderTransfer.value = 'root';
}

defineExpose({toggleState});
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.35s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
