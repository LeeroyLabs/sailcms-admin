<template>
    <div class="tw-flex tw-flex-row tw-w-full tw-justify-between tw-items-center tw-mb-4" v-if="hasPermission('readwrite_entry_layout')">
        <div class="tw-flex tw-flex-row tw-items-center">
            <v-select
                v-model="selectedAction"
                label="Actions"
                color="primary"
                :items="availableActions"
                variant="outlined"
                density="comfortable"
                single-line
                placeholder="Actions"
                :persistent-hint="false"
                :hide-details="true"
                class="tw-w-[200px]"
            ></v-select>

            <v-btn
                :class="{'tw-invisible tw-opacity-0': selectedAction === null, 'tw-opacity-100': selectedAction !== null}"
                class="!tw-hidden md:!tw-block tw-ml-2 tw-transition-opacity tw-duration-300"
                color="primary"
                size="small"
                icon
                @click.prevent="performAction"
            >
                <v-icon icon="mdi-chevron-right"/>
            </v-btn>
            <v-progress-circular indeterminate size="x-small" width="2" class="tw-ml-2" :class="{'tw-invisible': !applyingAction}"/>
        </div>

        <div class="tw-flex tw-flex-row tw-flex-grow tw-justify-end">
            <slot name="extra"/>
        </div>
    </div>
    <div v-else></div>

    <v-table class="utable">
        <thead>
            <tr>
                <th class="!tw-min-w-[4px] !tw-max-w-[4px]">
                    <v-checkbox @change="handleCheckAll" color="primary" value="checkall" hide-details></v-checkbox>
                </th>
                <template v-for="(column, idx) of columns">
                    <th :class="{'lg:tw-w-[35%]': idx === 0, '!tw-text-center': column.centered}">
                        {{ column.label }}
                    </th>
                </template>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, idx) in list" :key="item._id">
                <td class="!tw-min-w-[4px] !tw-max-w-[4px]">
                    <v-checkbox v-model="selectedItems" color="primary" :value="item" hide-details></v-checkbox>
                </td>
                <slot :row="item" :index="idx"/>
            </tr>
            <tr v-if="list.length === 0">
                <td colspan="6" class="tw-text-center tw-font-medium">{{ no_items }}</td>
            </tr>
        </tbody>
    </v-table>

    <template v-if="$slots.footer">
        <div class="tw-mt-4">
            <slot name="footer" :index="index" />
        </div>
    </template>


    <Transition>
        <DeleteConfirmation
            v-if="showDeleteConfirm"
            :show="true"
            :overall="true"
            :title="$t('users.confirm')"
            :loading="isDeleting"
            :message="deleteMessage"
            @cancel="showDeleteConfirm=false"
            @accept="confirmDelete"
        />
    </Transition>
</template>

<script setup>
import { hasPermission } from '@/libs/tools';
import { format } from 'date-fns';
import DeleteConfirmation from '@/components/globals/DeleteConfirmation.vue';
import { computed, ref } from 'vue';
import { Entries } from '@/libs/graphql/lib/entries';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/store/app';

const i18n = useI18n();
const store = useAppStore();

const props = defineProps({
    list: {
        type: Array,
        default: []
    },
    active: {
        type: Boolean,
        default: false
    },
    no_items: {
        type: String,
        default: ''
    },
    deleteCallback: {
        type: Function,
        default: () => {}
    },
    restoreCallback: {
        type: Function,
        default: () => {}
    },
    columns: {
        type: Array,
        default: []
    },
    deleteMessage: {
        type: String,
        default: ''
    },
    index: {
        type: Number,
        default: 0
    }
});

const emitter = defineEmits(['confirmDelete']);

const applyingAction = ref(false);
const showDeleteConfirm = ref(false);
const isDeleting = ref(false);
const selectedItems = ref([]);
const selectedAction = ref(null);

const availableActions = computed(() =>
{
    if (props.active) return [{value: 'delete', title: props.active ? i18n.t('system.trash') : i18n.t('system.delete')}];

    return [
        {value: 'restore', title: i18n.t('system.restore')},
        {value: 'delete', title: props.active ? i18n.t('system.trash') : i18n.t('system.delete')}
    ];
});

const handleCheckAll = (e) =>
{
    if (e.target.checked) selectedItems.value = props.list;
    if (!e.target.checked) selectedItems.value = [];
}

const performAction = async () =>
{
    if (selectedAction.value === 'delete') {
        showDeleteConfirm.value = true;
    } else {
        await confirmRestore();
    }
}

const confirmDelete = async () =>
{
    if (applyingAction.value) return;

    isDeleting.value = true;
    applyingAction.value = true;

    let list = [];

    for (let field of selectedItems.value) {
        list.push(field._id);
    }

    await props.deleteCallback({list: list, active: props.active});
    isDeleting.value = false;
    showDeleteConfirm.value = false;
    applyingAction.value = false;
}

const confirmRestore = async () =>
{
    if (applyingAction.value) return;

    isDeleting.value = true;
    applyingAction.value = true;

    let list = [];

    for (let field of selectedItems.value) {
        list.push(field._id);
    }

    await props.restoreCallback({list: list, active: props.active});
    isDeleting.value = false;
    applyingAction.value = false;
}
</script>


<style lang="postcss">
.utable tr:hover td {
    background-color: rgba(229, 231, 235, 0.20);
}
</style>
